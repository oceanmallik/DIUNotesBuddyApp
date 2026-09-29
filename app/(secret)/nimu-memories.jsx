import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SHORT_STORIES = [
  {
    id: 1,
    title: "The Glare That Stopped Time",
    content: `ছোট্ট একটা বিদ্যাপীঠ, চারপাশ বেশ শান্ত। মোস্তফা স্যারের ক্লাস চলছে আপন গতিতে। পিনপতন নীরবতার মাঝেই হঠাৎ বেজে উঠল একটা রিংটোন। স্যার তো রীতিমতো চমকে উঠলেন! ভরদুপুরে হঠাৎ কার ফোন? মনে মনে প্রমাদ গুনলেন তিনি, এই বুঝি গিন্নির কল! বুক দুরুদুরু অবস্থায় বাঁ দিকের পকেট থেকে স্যামসাং ফোনটা বের করলেন। স্ক্রিনের দিকে তাকিয়েই ধড়ে প্রাণ ফিরে এলো স্যারের। একটা স্বস্তির দীর্ঘশ্বাস ছাড়লেন। নাহ, গিন্নি নয়, স্ক্রিনে জ্বলজ্বল করছে 'আক্তার হোসেন' নামটা। তবে পরক্ষণেই স্যার বুঝলেন, এই কল আদতে তার জন্য নয়। ক্লাসের প্রথম সারির তৃতীয় বেঞ্চে বসা এক মেয়ের জন্য এসেছে এই তলব। স্যার মেয়েটিকে ডেকে ফোনটা এগিয়ে দিলেন। একটু নিরিবিলিতে কথা বলার জন্য মেয়েটি যেই না বেঞ্চ ছেড়ে উঠে দাঁড়াতে যাবে, ঠিক তখনই ঘটল আসল বিপত্তি! তার ঠিক পেছনেই বসা এক সুদর্শন ছেলে হঠাৎ করে অদ্ভুত আর বিশ্রী একটা শব্দ করে বসল। মুহূর্তেই ক্লাসের পরিবেশ থমথমে! মেয়েটি যাওয়ার পথে থমকে দাঁড়াল। ঘাড় ঘুরিয়ে এমন এক রাগান্বিত, তীক্ষ্ণ আর রক্তচক্ষু দৃষ্টিতে ছেলেটার দিকে তাকাল যে, ছেলেটার আত্মা খাঁচাছাড়া হওয়ার জোগাড়! কোনো কথা না বাড়িয়ে মেয়েটি হনহন করে বাইরে চলে গেল। কিন্তু এদিকে ছেলেটার অবস্থা তখন রীতিমতো শোচনীয়। তার চোখেমুখে স্পষ্ট আতঙ্ক, এই বুঝি মেয়ের বাবা লাঠিসোঁটা নিয়ে স্কুলে এসে হাজির হলো বলে! ভয়ে তার হাত-পা ঠান্ডা, মনে মনে শুধু ভাবছে,"আজ আর রক্ষা নেই, স্কুলে আজ আমার বিচার বসবেই!" কিন্তু কথায় আছে না, রাখে আল্লাহ মারে কে! ছেলেটার কপাল সে যাত্রায় ভালোই ছিল। সারাদিন আতঙ্কে প্রহর গুনলেও শেষমেশ কিছুই হলো না। বিশাল এক কালবৈশাখী ঝড় যেন বিনা মেঘেই শান্ত হয়ে গেল!`
  },
  {
    id: 2,
    title: "Footprints in the Dark",
    content: `গল্পটা খুব বেশিদিন আগের না, কিন্তু যখনই মনে পড়ে, গায়ের লোম খাড়া হয়ে যায়। আমাদের স্কুলের এক স্যার তার পুরনো, স্যাঁতসেঁতে বাড়িতে আমাদের প্রাইভেট পড়াতেন। আমরা কয়েকজন ছোট ছোট ছেলেমেয়ে ছিলাম। স্যারের কড়া নিয়ম ছিল, ঘরের বাইরে এক কোণে জুতো খুলে তারপর ভেতরে ঢুকতে হবে। যাওয়ার সময় আমাদের সবার জুতো একদম ঝকঝকে পরিষ্কার থাকতো। কিন্তু আসল ভয়ংকর ব্যাপারটা অপেক্ষা করে থাকতো পড়া শেষের মুহূর্তটার জন্য। পড়া শেষে যখন চারপাশটা একদম সুনসান হয়ে যেত, আমরা দরজা খুলে বাইরে আসতেই আমাদের রক্ত হিম হয়ে আসতো। বারান্দার সেই মিটমিটে আলোতে দেখতাম, আমাদের পরিষ্কার জুতোগুলোর ওপর দিয়ে যেন একটা তাণ্ডব বয়ে গেছে! জুতোগুলো স্যাঁতসেঁতে কাদায় মাখামাখি, কিন্তু সেগুলো কোনো সাধারণ কাদা নয়। যেন অতিকায়, বীভৎস কোনো পা আমাদের জুতোগুলোকে চরম আক্রোশে মাড়িয়ে দিয়ে গেছে। আশেপাশে কোনো মানুষের সাড়াশব্দ নেই, বাতাসে শুধু একটা ভ্যাপসা গন্ধ, অথচ জুতোগুলোর ওপর সেই অমানবিক পায়ের ছাপ! যেন কোনো এক অশরীরী ছায়ামূর্তি, যার পায়ের পাতাগুলো স্বাভাবিক মানুষের মতো নয়, সে প্রতিদিন অন্ধকারে দাঁড়িয়ে আমাদের জন্য অপেক্ষা করতো।ওই নোংরা, কাদামাখা জুতো পায়ে দিয়ে ফেরার সময় আমাদের সবার বুকের ভেতরটা ধড়ফড় করতো। মনে হতো অন্ধকারের ভেতর থেকে কেউ একজন আমাদের দিকে তাকিয়ে আছে, আর নিঃশব্দে হাসছে! প্রতিদিনের এই গা ছমছমে আতঙ্কটা আজও আমাদের তাড়া করে ফেরে।`
  },
  {
    id: 3,
    title: "A Lesson in Words",
    content: ` এবার শোনেন আরেক 'ভৌতিক' কাহিনী! তবে এই ভূতের বাস কোনো পোড়াবাড়িতে নয়, বরং ধ্রুব মিত্র নামের এক ছেলের মাথার ভেতর। ধ্রুব এমনিতে সবার সাথেই বেশ মিশুক। তবে মেয়েদের বেলায় তার 'মিশুক' সত্তাটা যেন একটু বেশিই চনমনে হয়ে উঠতো! তার একটা বদ্ধমূল ধারণা ছিল। সে প্রশংসা করলে দুনিয়ার সব মেয়েই সেটা দারুণভাবে নেবে। আগে দু-একবার হয়তো এই ফর্মুলা কাজে লেগেছে, তাই তার কনফিডেন্স তখন আকাশছোঁয়া। "আগে নিয়েছে, তো এখন নেবে না কেন?" এই ছিল তার জীবনের মূলমন্ত্র। তো একদিন ঘটলো সেই 'ভয়ংকর' ঘটনা। ওভার-কনফিডেন্সে ভর করে ধ্রুব সেই মেয়েটিকে দেখে তার সেই বিখ্যাত ডায়লগটা মেরেই বসল, "জানিস, তোর চোখগুলো না অনেক সুন্দর! একদম মায়াবী!" ধ্রুব ভেবেছিল মেয়েটি হয়তো লাজুক হাসবে। কিন্তু হায়! কোথায় কী! মুহূর্তের মধ্যেই সেই 'মায়াবী' চোখ দুটো যেন সাক্ষাৎ কালভৈরবের মতো রাগে ধকধক করে জ্বলে উঠল! এই মুহূর্ত যে চোখের পলকে এমন হরর মুভিতে রূপ নেবে, ধ্রুবর সেটা কল্পনারও বাইরে ছিল। মেয়েটার সেই রক্তচক্ষু চাহনি দেখে ধ্রুবর তো তখন আত্মার পানি শুকিয়ে যাওয়ার দশা! এরপর পরিস্থিতি সামাল দিতে বসল আমাদের বিখ্যাত 'গোল মিটিং'। বন্ধুবান্ধব সবাই মিলে রীতিমতো গোল হয়ে বসে ধ্রুবর ক্লাস নেওয়া শুরু করলাম। তাকে বিস্তর বুঝিয়ে-শুনিয়ে বলা হলো, "ভাই, থাম! তোর চোখে যেটা মায়াবী, সেটা যে অন্য কারও কাছে চরম বিরক্তিকর হতে পারে, এটা এবার অন্তত মাথায় ঢোকা! এভাবে গায়ে পড়ে প্রশংসা করলে মেয়েদের ভালো তো লাগেই না, উল্টো ওই মায়াবী চোখ থেকে যেকোনো সময় লেজার রশ্মি বের হয়ে তোকে ভস্ম করে দিতে পারে!" শেষমেশ অনেক কাঠখড় পুড়িয়ে ধ্রুবর মাথা থেকে এই 'মায়াবী চোখের' ভূত নামানো সম্ভব হয়েছিল!`
  },
  {
    id: 4,
    title: "Where Our Story Began",
    content: `এবার শোনেন এক অদ্ভুত বন্ধুত্বের গল্প, যা শুধুই পরিচয়ে আটকে থাকেনি, বরং ধীরে ধীরে রূপ নিয়েছে এক অটুট ভাই-বোনের মিষ্টি বন্ধনে। ঘটনার সূত্রপাত মোস্তফা স্যারের প্রাইভেট ব্যাচে। একদিন স্যার হঠাৎ ওশানকে ডেকে বললেন, "এই ওশান, তুমি নীমুকেও তোমার প্রজেক্টের দলে নিও।" ওশান তো তখন মহা চিন্তায় পড়ে গেল! ভ্রু কুঁচকে ভাবতে লাগল, এই নীমুটা আবার কে ভাই? কিছুক্ষণ স্মৃতি হাতড়ানোর পর হঠাৎ তার মনে পড়ল, ওহ হ্যাঁ! ওই যে প্রথম সারির তিন নম্বর বেঞ্চের ডান দিকে বসে থাকা শান্তশিষ্ট মেয়েটি! শুরু হলো প্রজেক্টের কাজ। দলের 'সর্বাধিনায়ক' ওশান সবাইকে যার যার দায়িত্ব বুঝিয়ে দিল। সারাদিন সবাই মিলে কত কী বানালো! শেষে দেখা গেল, নীমু তার এক বন্ধুকে নিয়ে কাগজ-টাগজ কেটেকুটে কী একটা যেন বানিয়ে নিয়ে হাজির। এটাই নাকি তাদের সেই বহু প্রতীক্ষিত 'তথাকথিত প্রজেক্ট'! দলের নেতা হিসেবে ওশান ব্যাপারটা মেনে নিল ঠিকই, কিন্তু মনে মনে একটু মজাই পেল। অবশেষে এলো সেই কাঙ্ক্ষিত প্রজেক্ট শোর দিন! সে এক অনবদ্য সকাল। সোনালি রোদে চারপাশ ঝলমল করছে, ফুরফুরে বাতাসে যেন বিজয়ের সুবাস ভাসছে। পাখির কলকাকলি আর চারপাশের উৎসবমুখর পরিবেশের মাঝখানে ময়দানে তৎকালীন সর্বশ্রেষ্ঠ বীর নেতা ওশান তার দলবল নিয়ে বীরদর্পে দাঁড়িয়ে! প্রজেক্ট প্রদর্শন চলছে পুরোদমে। ওশান তার নিজের কাজ নিয়ে তুমুল ব্যস্ত। এর মাঝে তার সাধের ল্যাপটপটা পাহারা দেওয়ার মহান দায়িত্ব পড়েছে নীমুর ওপর। বেচারি এক কোণে চুপচাপ ল্যাপটপ আগলে বসে আছে। মুখে কোনো কথা নেই, মনে যেন বিন্দুমাত্র আনন্দ নেই। ওশান তো এমনিতেই 'ভীষণ ভালো মানুষ'! দলের এক সদস্যের এমন মন খারাপ অবস্থা দেখে তার আর সহ্য হলো না। সে কাজ ফেলে এগিয়ে গিয়ে বলল, "কী রে, এভাবে মুখ গোমড়া করে বসে আছিস কেন? চল, অন্যান্য স্টলগুলো একটু ঘুরে দেখি!" এ কথা শুনে নীমুর মুখে যেন হাজার ওয়াটের বাল্ব জ্বলে উঠল! আনন্দে লাফিয়ে উঠল সে। ঘুরতে ঘুরতে তারা গিয়ে হাজির হলো রামভদ্রপুর স্কুলের স্টলে। সেখানে নীমুর পূর্বপরিচিত আবির নামের এক ছেলের সাথে দেখা। ওশান বেশ উৎসাহ নিয়ে দুজনের পরিচয় করিয়ে দিল। ওশান: "নীমু, এই হচ্ছে আবির। আর আবির, এই হলো নীমু।" আবির (বেশ ভাব নিয়ে): "ওহ, আচ্ছা! তা ভাই, তোমরা কী প্রজেক্ট এনেছ? আমাদেরটা তো দেখছই, একদম অত্যাধুনিক মডেল!" ওশান (প্রজেক্টের দিকে বাঁকা চোখে তাকিয়ে): "ভাই, তোমার এই অত্যাধুনিক মডেলের সাথে তো আমি আমার এক দূরসম্পর্কের আত্মীয়ের শ্বশুরবাড়ির দারুণ মিল পাচ্ছি! "আবির (অবাক হয়ে): "মানে? প্রজেক্টের সাথে শ্বশুরবাড়ির কী সম্পর্ক?" ওশান (হাসি চেপে একদম সিরিয়াস মুখে): "আরে ভাই, সম্পর্ক তো ভীষণ গভীর! তোমার প্রজেক্টের ওই যে লাল বাতিটা জ্বলছে আর নিভছে, ঠিক যেন শ্বশুরবাড়ির ড্রয়িংরুমের সেই নষ্ট টিউবলাইট! আর এই যে তারগুলো পেঁচিয়ে রেখেছ, এটা তো হুবহু আমার সেই আত্মীয়ের শাশুড়ির জিলাপি প্যাঁচানো কথার মতো! তা ভাই, সত্যি করে বলো তো, প্রজেক্টটা কি শ্বশুরবাড়ির অনুপ্রেরণায় বানানো, নাকি শাশুড়ির ভয়ে?" নীমুর তো তখন হাসতে হাসতে পেট ব্যথা হওয়ার জোগাড়! আর বেচারা আবির? ওশানের এমন অদ্ভুত আর উল্টোপাল্টা প্রশ্নের তোপে একেবারে নাস্তানাবুদ! লজ্জায় আর অপমানে তার মুখ তখন ওই লাল বাতির  মতোই জ্বলজ্বল করছে, আর মুখ দিয়ে কোনো কথাই সরছে না। এভাবেই হাসি-ঠাট্টা আর তুমুল উল্লাসে দিনটা শেষ হলো। শুধু কি তাই? দিন শেষে সমস্ত প্রতিযোগীকে পেছনে ফেলে 'সর্বশ্রেষ্ঠ বীর' ওশান তার দল নিয়ে প্রথম স্থানও অধিকার করে নিল! আর সেই সাথে শুরু হলো ওশান আর নীমুর এক নতুন পথচলা, যে বন্ধুত্বের শুরুটা হয়েছিল একটা সাধারণ প্রজেক্ট আর ল্যাপটপ পাহারা দেওয়া দিয়ে, সেটাই পরিণত হলো একে অপরের খেয়াল রাখা এক দারুণ ভাই-বোনের সম্পর্কে।`
  },
  {
    id: 5,
    title: "Our Unforgettable First Treat",
    content: `এবার শুনুন এক ঐতিহাসিক 'ট্রিট' বা আপ্যায়নের গল্প! ওশানকে দেওয়া নীমুর জীবনের প্রথম ট্রিটের এক যুগান্তকারী কাহিনী। ঘড়িতে তখন বেলা প্রায় ১১টা বাজে। নীমু, যাকে মজা করে 'আন্টির মেয়ে' বলেও ডাকা যায়, তার কম্পিউটার ক্লাস শেষ করে সবে বের হয়েছে। ঘটনা হচ্ছে, এর আগের দিনই নীমু বেশ একটা রাজকীয় ভাব নিয়ে ওশানকে বলেছিল, "কাল দেখা করিস, তোকে কিছু কিনে খাওয়াবোনে!" এই কথা শোনার পর থেকে ওশানের তো আর তর সইছিল না! 'ট্রিট' বলে কথা, তাও আবার নীমুর কাছ থেকে! ওশানের কল্পনার ঘোড়া তখন রীতিমতো ছুটতে শুরু করেছে। সে মনে মনে বিশাল এক মেনু সাজিয়ে ফেলল। অন্ততপক্ষে এক প্লেট গরম গরম, ধোঁয়া ওঠা মোরগ পোলাও তো আজ জুটবেই! এমন এক রাজকীয় ভোজের আশা আর বুকভরা আগ্রহ নিয়ে ওশান নির্দিষ্ট সময়ে দেখা করতে হাজির হলো। কিন্তু স্পটে গিয়ে ওশান দেখে পরিস্থিতি সম্পূর্ণ ভিন্ন! কোথায় মোরগ পোলাওয়ের আড্ডা, আর কোথায় কী! নীমুর তো দাঁড়িয়ে দুটো কথা বলারই সময় নেই। সে যেন রীতিমতো কোনো এক্সপ্রেস ট্রেনের মতো তাড়ার ওপর আছে। ওশানকে দেখেই নীমু এক নিঃশ্বাসে জিজ্ঞেস করল, "কী খাবি?" ওশান বেচারা যেই না একটু লাজুক হেসে মুখ খুলে তার কল্পনার মোরগ পোলাওয়ের নামটা বলতে যাবে, তার আগেই নীমু আবার নিজেই বলে উঠল, "নে, এই মোজো খা!" কোনো কিছু বোঝার আগেই, চোখের পলকে পাশের একটা দোকান থেকে এক বোতল 'মোজো' কিনে ওশানের হাতে ধরিয়ে দিল সে। তারপর একগাল হেসে বলল, "যা, এবার তুই বাসায় যা, আমিও যাই!" ওশান তখন রীতিমতো হতভম্ব! এক হাতে মোজোর বোতল আর মনে মোরগ পোলাওয়ের আক্ষেপ নিয়ে সে রাস্তার মাঝখানে স্ট্যাচুর মতো দাঁড়িয়ে রইল। ওদিকে 'আন্টির মেয়ে' নীমু ততক্ষণে ব্যস্ত পায়ে হাওয়া! এভাবেই মাত্র কয়েক সেকেন্ডের ঝড়ে শেষ হলো নীমুর দেওয়া সেই বহু কাঙ্ক্ষিত, ঐতিহাসিক 'প্রথম ট্রিট'!`
  },
  {
    id: 6,
    title: "The Unexpected Admirers",
    content: `নীমু তখন পড়ে কলেজে। যাওয়া-আসার পথে তাকে নিয়ে যে এক অদ্ভুত ঘটনা ঘটতো, তা শুনলে হাসতে হাসতে পেট ব্যথা হয়ে যাওয়ার জোগাড় হবে। সেবার নীমু রীতিমতো এক নতুন খেতাব পেয়ে বসল, 'পিচ্চিদের ক্রাশ'! কলেজের রাস্তায় তখন ক্লাস সিক্স-সেভেনে পড়া পিচ্চি পিচ্চি ছেলেদের মেলা। বয়সে ছোট হলে কী হবে, তাদের সাহস আর হাবভাব দেখলে পাড়ার বড় ভাইয়েরাও লজ্জায় মুখ লুকাবে! তো এই প্যান্ট আর স্কুল ড্রেস পরা পিচ্চি গ্যাংয়ের সবার নজর গিয়ে পড়ল আমাদের নীমুর ওপর। কলেজ ছুটির পর নীমু যখন বই-খাতা হাতে নিয়ে বেশ একটা বড়সড় ভাব নিয়ে হেঁটে হেঁটে বাড়ি ফিরত, তখন রাস্তার মোড়ে মোড়ে এই পিচ্চি রোমিওগুলো দাঁড়িয়ে থাকত। নীমুকে দেখলেই তাদের মধ্যে একটা চাপা উত্তেজনা শুরু হয়ে যেত। একদিন তো এক পিচ্চি সাহস করে একেবারে সামনেই এসে হাজির! কাঁচুমাচু মুখ, চোখে রাজ্যের মুগ্ধতা, আর গলাটা একটু খাঁকারি দিয়ে সে জিজ্ঞেস করে বসল, "আপু, আপনি কোন ক্লাসে পড়েন?” নীমু তো অবাক! এমন আনকোরা প্রশ্ন শুনে চোখ বড় বড় করে বলল, "কেন রে? জেনে কী করবি?" পিচ্চি তখন একটা লাজুক হাসি দিয়ে, পা দিয়ে মাটি খুঁটতে খুঁটতে বলল, "না মানে, এমনিই জিজ্ঞেস করছিলাম... আপু আপনার নাম কী? আপনি কি ওই কলেজটায় পড়েন?" পিচ্চিদের এই 'এমনিই' জিজ্ঞেস করার পেছনের আসল কারণ বুঝতে নীমুর আর বাকি রইল না। এরপর থেকে রাস্তা দিয়ে হাঁটার সময় দেখা যেত, ওই ক্লাস সিক্স-সেভেনের ছেলেগুলো নীমুকে দেখলেই নিজেদের শার্টের কলার ঠিক করছে, কেউ আবার একটু ভাব নিয়ে বড়দের মতো হাঁটার চেষ্টা করছে!`
  },
  {
    id: 7,
    title: "Miles, Memories, and Us",
    content: `এবার চলুন ঢাকা যাওয়ার পথে ওশান আর নীমুর সেই মহাকাব্যিক সফরের গল্পে, যেখানে ছিল বুদ্ধি, বোকামি, আর পেটপূজোর দারুণ এক মিশেল। দুজনেই চলেছে ঢাকায়, পড়াশোনার তাগিদে। শুরুটা হলো অটো দিয়ে। শরীয়তপুর পর্যন্ত যাওয়ার পথে অটোর ঠিক মাঝখানে এক বুড়ি এসে বসলেন। তবে সেই বুড়ির গল্প বাদই থাক, আসল ঘটনা শুরু হলো শরীয়তপুর বাসস্ট্যান্ডে পৌঁছানোর পর। স্ট্যান্ডে পৌঁছে ওশান তার ভেতরের 'মাস্টারমাইন্ড' সত্তাকে জাগিয়ে তুলল। সে দারুণ এক বুদ্ধি বের করে নীমুকে বলল, "চল, এই বাসে না উঠে আমরা বরং পরের বাসটার জন্য অপেক্ষা করি। তাহলে একদম বেছে বেছে সবচেয়ে ভালো সিটটা পাবো!" এমন মাস্টারস্ট্রোক বুদ্ধি যে মানুষের মাথায় আসতে পারে, সেটা নীমুর ধারণারও বাইরে ছিল। ওশানের এই দূরদর্শিতা দেখে সে তো রীতিমতো মুগ্ধ! দারুণ এক সিট পাওয়ার আনন্দে বুক ফুলিয়ে দুজনে গিয়ে বসল সেই পরের বাসে। কিন্তু কথায় আছে না— অতি চালাকের গলায় দড়ি! কিছুক্ষণ পরই ড্রাইভার এসে ঘোষণা দিল, "বাসে সমস্যা আছে, এই গাড়ি আজ যাবে না!" দুজনের মুখের অবস্থা তখন দেখার মতো। বাধ্য হয়ে সব যাত্রীর সাথে তাদেরও নেমে যেতে হলো। শেষমেশ অন্য একটা বাসে উঠে তাদের জায়গা জুটল একদম পেছনের দিকের সিটগুলোতে। দুজনেরই তখন একটাই আক্ষেপ— হায়রে কপাল! দুপুরের কড়া রোদ মাথায় নিয়ে বাস চলতে শুরু করল। নীমু তার চিরচেনা রুটিন মেনে ব্যাগ থেকে বই বের করে পড়ায় ডুবে গেল, আর ওশান তার ফোন বের করে মনোযোগ দিল গেমে। বাস যখন জাজিরা পৌঁছাল, তখন বাসে এক পেয়ারা বিক্রেতা উঠল। পেয়ারা দেখে নীমুর তো লোভ সামলানো দায়! সে ইশারা করতেই ওশান টুক করে পেয়ারা কিনে ফেলল। দুজনে মিলে বেশ আয়েশ করে পেয়ারা খেল। খাওয়া শেষে নীমু আবার তার বইয়ের দুনিয়ায় ফেরত। বাস তখন পদ্মা সেতুর কাছাকাছি। এমন সময় বাসে উঠল এক ছোলা বিক্রেতা। প্রথমে দুজনেই একটু ইতস্তত করছিল, কিন্তু শেষে নীমুই রায় দিল— "নে, ছোলা নে!" ছোলা তো কেনা হলো, কিন্তু মুখে দেওয়ার পর দুজনেরই চোখ ছানাবড়া! এ তো সাধারণ ছোলা নয়, এ যেন রীতিমতো অমৃত! পৃথিবীর বুকে এর চেয়ে সুস্বাদু ছোলা হয়তো আর কেউ কোনোদিন বানাতে পারেনি। সেই স্বর্গীয় ছোলা খেয়ে তারা আবারও যার যার রুটিনে— নীমু বইয়ে, আর ওশান গেমে। অবশেষে বাস এসে পৌঁছাল যাত্রাবাড়ী। সেখান থেকে একটা রিকশা নিয়ে তারা সোজা চলে এলো মেট্রো স্টেশনে। আর এখানেই শুরু হলো ওশানের জীবনের সবচেয়ে বড় ট্র্যাজেডি। সমস্ত পোঁটলা-পুঁটলি, ব্যাগ-ব্যাগেজের দায়িত্ব অবধারিতভাবেই এসে পড়ল ওশানের ঘাড়ে। সেসব নিয়ে কোনোমতে মেট্রোতে উঠল তারা। কিন্তু মেট্রো ছাড়ার সময়কার সেই বিখ্যাত ঝাঁকুনিতে মালপত্র সামলাতে গিয়ে ওশান তখন প্রায় বেহাল! ফার্মগেট স্টেশনে যখন তারা নামল, তখন দুজনের অবস্থা দেখলে যে কেউ হাসতে বাধ্য। নীমুর পিঠে শুধু তার নিজের ছোট্ট একটা ব্যাগ, সে বেশ ফুরফুরে মেজাজে হাঁটছে। আর ওশানের অবস্থা তখন রীতিমতো কুলি নম্বর ওয়ানের মতো! তার কাছে নীমুর দুইটা ভারী ব্যাগ, নিজের একটা হাতব্যাগ, আর পিঠে ঝোলানো নিজের আরেকটা বড় ব্যাগ। সব মিলিয়ে ওশান যেন একটা চলন্ত মালগাড়ি! এই বিশাল বোঝা ঘাড়ে নিয়েই ওশান বীরের মতো নীমুকে তার হোস্টেল পর্যন্ত নিরাপদে পৌঁছে দিল। এরপর হাঁফ ছাড়তে ছাড়তে একটা লম্বা সালাম দিয়ে সেদিনের মতো বিদায় নিল ওশান।`
  }
];

export default function NimuMemories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStory = SHORT_STORIES[currentIndex];

  const handleNext = () => {
    if (currentIndex < SHORT_STORIES.length - 1) {
      setIsOpen(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReveal = () => {
    setIsOpen(true);
  };

  const renderWelcome = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="book-outline" size={60} color="#EAE0D5" style={{ marginBottom: 20 }} />
      <Text style={[styles.welcomeTitle, { textAlign: 'center', paddingHorizontal: 20 }]}>Welcome to Nimu&apos;s Memories</Text>
      <Text style={[styles.welcomeSubtitle, { textAlign: 'center', paddingHorizontal: 20 }]}>A collection of unforgettable moments...</Text>
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={() => setHasStarted(true)}
      >
        <Text style={styles.startButtonText}>Begin the Journey</Text>
        <Ionicons name="sparkles" size={20} color="#FFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );

  const renderFinished = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="gift-outline" size={80} color="#EAE0D5" style={{ marginBottom: 10 }} />
      <Text style={[styles.welcomeTitle, { textAlign: 'center', paddingHorizontal: 20, marginBottom: 5 }]}>
        Happy birthday Nimu, bkash e 100 taka patha.
      </Text>
      <Image
        source={{ uri: 'https://www.oceanmallik.com/banglaQR.jpg' }}
        style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
        resizeMode="contain"
      />
      <Text style={[styles.welcomeSubtitle, { textAlign: 'center', paddingHorizontal: 20, marginTop: 15, fontSize: 18, marginBottom: 20 }]}>
        এইটা স্ক্যান করে পেমেন্ট পাঠা
      </Text>
      <TouchableOpacity
        style={[styles.startButton, { marginTop: 10 }]}
        activeOpacity={0.8}
        onPress={() => {
          setIsFinished(false);
          setHasStarted(false);
          setCurrentIndex(0);
          setIsOpen(false);
        }}
      >
        <Text style={styles.startButtonText}>Read Again</Text>
        <Ionicons name="refresh" size={20} color="#FFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );

  const renderProgressBar = () => {
    const progress = (currentIndex + 1) / SHORT_STORIES.length;
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Story {currentIndex + 1} of {SHORT_STORIES.length}
        </Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    );
  };

  const renderEnvelope = () => (
    <View style={styles.centerContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleReveal}
        style={styles.envelopeContainer}
      >
        <View style={styles.envelopeTopFlap} />

        <View style={styles.envelopeContent}>
          <View style={styles.waxSeal}>
            <Ionicons name="heart" size={24} color="#FFF" />
          </View>
          <Text style={styles.envelopeTitle}>For Nimu</Text>
          <Text style={styles.envelopeSubtitle}>Memory {currentIndex + 1}</Text>
          <Text style={styles.tapToOpen}>Tap to open letter</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderLetter = () => (
    <View style={styles.letterWrapper}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.paper}>
          <Text style={styles.dateText}>Memory #{currentStory.id}</Text>
          <Text style={styles.letterTitle}>{currentStory.title}</Text>
          <View style={styles.divider} />

          <Text style={styles.letterBody}>
            {currentStory.content}
          </Text>

          <View style={styles.signatureContainer}>
            <Text style={styles.signature}>Written by,</Text>
            <Text style={styles.signatureName}>Ocean</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === SHORT_STORIES.length - 1 ? "Finish" : "Next Story"}
          </Text>
          {currentIndex !== SHORT_STORIES.length - 1 ? (
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          ) : (
            <Ionicons name="checkmark-done" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {!hasStarted && !isFinished && renderWelcome()}
      {hasStarted && !isFinished && renderProgressBar()}
      {hasStarted && !isFinished && (isOpen ? renderLetter() : renderEnvelope())}
      {isFinished && renderFinished()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3E3227', // Dark wood desk aesthetic
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Welcome & Finish Screens
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#EAE0D5',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#C8BBAE',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#8C7A6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  // Progress Bar
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    alignItems: 'center',
  },
  progressText: {
    color: '#EAE0D5',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#5C4A3D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4AF37', // Gold color
    borderRadius: 3,
  },
  // Envelope Styles
  envelopeContainer: {
    width: width * 0.85,
    height: width * 0.55,
    backgroundColor: '#EAE0D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#C8BBAE',
    overflow: 'hidden', // to keep the flap inside the rounded corners
  },
  envelopeTopFlap: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: (width * 0.85) / 2,
    borderRightWidth: (width * 0.85) / 2,
    borderTopWidth: (width * 0.85) * 0.35,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#DFD2C4',
    zIndex: 1,
  },
  envelopeContent: {
    alignItems: 'center',
    zIndex: 2,
    marginTop: 40,
  },
  waxSeal: {
    position: 'absolute',
    top: -65, // Adjust this so it sits near the tip of the flap
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9A2A2A', // Deep red wax color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  envelopeTitle: {
    fontSize: 26,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#4A3B32',
    marginTop: 10,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  envelopeSubtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#7A6B5C',
    marginBottom: 16,
  },
  tapToOpen: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#9E8D7D',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Letter Styles
  letterWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  paper: {
    width: width * 0.9,
    backgroundColor: '#FDFBF7', // Off-white paper color
    padding: 30,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    minHeight: height * 0.6,
    borderWidth: 1,
    borderColor: '#EFEAE0',
  },
  dateText: {
    fontSize: 13,
    color: '#A08E7D',
    fontFamily: 'SpaceGrotesk-Regular',
    textAlign: 'right',
    marginBottom: 15,
  },
  letterTitle: {
    fontSize: 22,
    color: '#2C241B',
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAE0D5',
    marginBottom: 25,
    width: '70%',
    alignSelf: 'center',
  },
  letterBody: {
    fontSize: 15,
    color: '#3E3227',
    fontFamily: 'SpaceGrotesk-Regular',
    lineHeight: 24,
  },
  signatureContainer: {
    marginTop: 50,
    alignItems: 'flex-end',
  },
  signature: {
    fontSize: 16,
    color: '#5C4A3D',
    fontFamily: 'SpaceGrotesk-Regular',
  },
  signatureName: {
    fontSize: 20,
    color: '#2C241B',
    fontFamily: 'SpaceGrotesk-Bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#8C7A6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    alignSelf: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  }
});
