import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { note_id, final_topic } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: note, error: dbError } = await supabaseAdmin
      .from('pending_notes')
      .select('*')
      .eq('id', note_id)
      .single()

    if (dbError || !note) throw new Error("Note record not found in database.")

    const ghToken = Deno.env.get('GITHUB_TOKEN')
    const ghOwner = Deno.env.get('GITHUB_REPO_OWNER')
    const ghRepo = Deno.env.get('GITHUB_REPO_NAME')
    
    if (!ghToken || !ghOwner || !ghRepo) {
      throw new Error("Missing GitHub configuration settings on server.")
    }

    const { data: fileData, error: fileError } = await supabaseAdmin
      .storage
      .from('staging_notes')
      .download(note.file_path)

    if (fileError) throw new Error("Failed to retrieve file from staging storage.")

    const arrayBuffer = await fileData.arrayBuffer()
    const base64File = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    const sanitizedTopic = final_topic.replace(/[^a-zA-Z0-9-_]/g, '-');
    const sanitizedSubject = note.subject.replace(/[^a-zA-Z0-9-_]/g, '-');
    const targetFolder = `${note.department_id}/Year-${note.year}/Sem-${note.semester}/${sanitizedSubject}/${sanitizedTopic}`
    const targetFilePath = `${targetFolder}/${note.file_path.split('/').pop()}`
    const manifestPath = "manifest.json"

    const headers = {
      "Authorization": `Bearer ${ghToken}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    }

    let manifestData = []
    let manifestSha = null

    const manifestRes = await fetch(`https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${manifestPath}`, { headers })
    if (manifestRes.status === 200) {
      const manifestJson = await manifestRes.json()
      manifestSha = manifestJson.sha
      manifestData = JSON.parse(atob(manifestJson.content))
    }
    const newEntry = {
      id: note.id,
      department: note.department_id,
      year: note.year,
      semester: note.semester,
      subject: note.subject,
      topic: final_topic,
      file_path: targetFilePath,
      uploader_name: note.uploader_name,
      uploaded_at: note.created_at
    }
    manifestData.push(newEntry)

    const uploadFileRes = await fetch(`https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${targetFilePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Add note: ${note.subject} - ${final_topic}`,
        content: base64File
      })
    })

    if (!uploadFileRes.ok) {
      const errText = await uploadFileRes.text()
      throw new Error(`GitHub File upload execution failure: ${errText}`)
    }

    const updateManifestRes = await fetch(`https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${manifestPath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Update manifest index [skip ci]`,
        content: btoa(JSON.stringify(manifestData, null, 2)),
        sha: manifestSha ?? undefined
      })
    })

    if (!updateManifestRes.ok) throw new Error("GitHub Manifest compilation write failure.")

    await supabaseAdmin
      .from('pending_notes')
      .update({ status: 'approved' })
      .eq('id', note_id)

    await supabaseAdmin
      .storage
      .from('staging_notes')
      .remove([note.file_path])

    return new Response(
      JSON.stringify({ success: true, message: "Note approved and successfully cataloged on GitHub." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})