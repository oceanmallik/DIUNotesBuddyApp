import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { IconCheck, IconDotsVertical, IconEdit, IconListCheck, IconPlus, IconTrash, IconX, IconBook, IconCode, IconBriefcase, IconHeart, IconStar, IconFlame, IconTarget, IconTrophy, IconCoffee } from '@tabler/icons-react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Animated } from 'react-native';
import { useAppTheme } from '../../logic/ThemeProvider';
import Header, { useHeaderHeight } from '../../appDesign/header.js';
import { AppButton } from '../../appDesign/button.js';
import { Mountain, Tree } from '../../appDesign/texts.js';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const availableIcons = [
  { id: 'list', component: IconListCheck },
  { id: 'book', component: IconBook },
  { id: 'code', component: IconCode },
  { id: 'briefcase', component: IconBriefcase },
  { id: 'target', component: IconTarget },
  { id: 'trophy', component: IconTrophy },
  { id: 'heart', component: IconHeart },
  { id: 'star', component: IconStar },
  { id: 'flame', component: IconFlame },
  { id: 'coffee', component: IconCoffee },
];

const PlanCard = ({ item, colors, activeTheme, handleDelete, openEditModal, changeStatusImmediate, isSelectionMode, isSelected, onToggleSelect, onLongPress }) => {
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.spring(expandAnim, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const handlePress = () => {
    if (isSelectionMode) {
      onToggleSelect();
    } else {
      toggleExpand();
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Done') return '#00E676';
    if (status === 'In Process') return '#FFA000';
    return colors.accent;
  };
  const statusColor = getStatusColor(item.status);
  const drawerStatuses = ['To Do', 'In Process', 'Done'];
  const statusIndex = drawerStatuses.indexOf(item.status);
  const sliderAnim = useRef(new Animated.Value(statusIndex)).current;

  useEffect(() => {
    Animated.spring(sliderAnim, {
      toValue: drawerStatuses.indexOf(item.status),
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();
  }, [item.status]);

  const sliderLeft = sliderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0%', '33.33%', '66.66%']
  });

  const IconComponent = availableIcons.find(i => i.id === (item.icon || 'list'))?.component || IconListCheck;

  return (
    <View style={{ marginBottom: 10 }}>
      <AnimatedPressable 
        style={[
            styles.profileCard, 
            { 
                backgroundColor: colors.card, 
                borderColor: colors.border, 
                borderWidth: StyleSheet.hairlineWidth,
                shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                transform: [{ scale: scaleAnim }]
            }
        ]}
        onPress={handlePress}
        onLongPress={onLongPress}
        delayLongPress={300}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.avatarCircle, { backgroundColor: isSelected ? colors.accent : statusColor + '15' }]}>
            {isSelected ? (
                <IconCheck size={24} color="#FFF" />
            ) : (
                <IconComponent size={24} color={statusColor} />
            )}
        </View>
        
        <View style={styles.infoContainer}>
            <Text style={[styles.nameText, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
            {item.details ? (
                <Text style={[styles.emailText, { color: colors.textSecondary }]}>{item.details}</Text>
            ) : null}
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <View style={[styles.typeBadge, { backgroundColor: statusColor + '15' }]}>
                    <Text style={[styles.typeText, { color: statusColor }]}>
                        {item.status}
                    </Text>
                </View>

                {!isSelectionMode && (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Pressable onPress={() => openEditModal(item)} style={styles.actionBtn}>
                          <IconEdit size={18} color={colors.textSecondary} />
                      </Pressable>
                      <Pressable onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                          <IconTrash size={18} color={colors.destructive} />
                      </Pressable>
                  </View>
                )}
            </View>
        </View>
      </AnimatedPressable>

      <Animated.View 
        style={[
            styles.drawerContainer, 
            { 
                backgroundColor: colors.card,
                shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
                zIndex: -1,
                opacity: expandAnim,
                maxHeight: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 120]
                }),
                marginTop: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -16]
                }),
                paddingTop: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 16]
                }),
                paddingBottom: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 8]
                }),
                transform: [{
                    translateY: expandAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                    })
                }]
            }
        ]}
        pointerEvents={expanded ? 'auto' : 'none'}
      >
        <View style={[styles.segmentedControlContainer, { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
            <Animated.View style={[
                styles.segmentedSlider, 
                { 
                    left: sliderLeft,
                    backgroundColor: statusColor 
                }
            ]} />
            
            {drawerStatuses.map((status) => {
                const isCurrent = status === item.status;
                return (
                    <Pressable 
                        key={status}
                        style={styles.segmentedButton} 
                        onPress={() => {
                            if (!isCurrent) {
                                changeStatusImmediate(item.id, status);
                            }
                        }}
                    >
                        <Text style={[
                            styles.segmentedButtonText, 
                            { color: isCurrent ? '#FFFFFF' : getStatusColor(status) }
                        ]}>{status}</Text>
                    </Pressable>
                );
            })}
        </View>
      </Animated.View>
    </View>
  );
};

export default function Plan() {
  const { colors, activeTheme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'To Do', 'In Process', 'Done'];

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatusVisible, setBulkStatusVisible] = useState(false);
  const isSelectionMode = selectedIds.length > 0;
  
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDetails, setTempDetails] = useState('');
  const [tempStatus, setTempStatus] = useState('To Do');
  const [tempIcon, setTempIcon] = useState('list');
  const titleInputRef = useRef(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('reading_plans');
      if (storedPlans !== null) {
        setPlans(JSON.parse(storedPlans));
      } else {
        const defaultPlans = [
          {
            id: 'default-1',
            title: 'Explore Notes Buddy',
            details: 'Check out the downloads tab to find resources for your courses!',
            status: 'Done',
            icon: 'star',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'default-2',
            title: 'Create Your First Plan',
            details: 'Tap the Add New Plan button to start tracking your reading tasks.',
            status: 'To Do',
            icon: 'flame',
            createdAt: new Date().toISOString(),
          }
        ];
        setPlans(defaultPlans);
        await AsyncStorage.setItem('reading_plans', JSON.stringify(defaultPlans));
      }
    } catch (e) {
      console.error('Failed to load plans.', e);
    }
  };

  const savePlans = async (newPlans) => {
    try {
      await AsyncStorage.setItem('reading_plans', JSON.stringify(newPlans));
      setPlans(newPlans);
    } catch (e) {
      console.error('Failed to save plans.', e);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setTempTitle('');
    setTempDetails('');
    setTempStatus(activeTab === 'All' ? 'To Do' : activeTab);
    setTempIcon('list');
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setTempTitle(item.title);
    setTempDetails(item.details || '');
    setTempStatus(item.status);
    setTempIcon(item.icon || 'list');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!tempTitle.trim()) {
      Alert.alert('Validation Error', 'Title is required.');
      return;
    }

    let updatedPlans;
    if (editingId) {
      updatedPlans = plans.map(p => 
        p.id === editingId 
          ? { ...p, title: tempTitle, details: tempDetails, status: tempStatus, icon: tempIcon } 
          : p
      );
    } else {
      const newPlan = {
        id: Date.now().toString(),
        title: tempTitle,
        details: tempDetails,
        status: tempStatus,
        icon: tempIcon,
        createdAt: new Date().toISOString(),
      };
      updatedPlans = [newPlan, ...plans];
    }
    
    savePlans(updatedPlans);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId === 'bulk') {
      savePlans(plans.filter(p => !selectedIds.includes(p.id)));
      setDeleteConfirmId(null);
      setSelectedIds([]);
    } else if (deleteConfirmId) {
      savePlans(plans.filter(p => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const changeStatusImmediate = (id, newStatus) => {
    const updatedPlans = plans.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    );
    savePlans(updatedPlans);
  };

  const confirmStatusChange = () => {
    if (confirmAction?.id === 'bulk') {
      const updatedPlans = plans.map(p => 
        selectedIds.includes(p.id) ? { ...p, status: confirmAction.newStatus } : p
      );
      savePlans(updatedPlans);
      setBulkStatusVisible(false);
      setConfirmAction(null);
      setSelectedIds([]);
    }
  };

  const filteredPlans = activeTab === 'All' ? plans : plans.filter(p => p.status === activeTab);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.bg}>
        <View style={[styles.tabsWrapper, { paddingTop: headerHeight + 12 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {tabs.map(tab => {
              const isActive = activeTab === tab;
              const tabColor = tab === 'Done' ? '#00E676' : tab === 'In Process' ? '#FFA000' : colors.accent;
              return (
                <Pressable
                  key={tab}
                  style={[
                    styles.tabButton,
                    { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    isActive && { backgroundColor: tabColor }
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[
                    styles.tabText,
                    { color: isActive ? '#FFFFFF' : tabColor }
                  ]}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          data={filteredPlans}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconListCheck size={64} color={colors.textSecondary} opacity={0.5} />
              <Mountain title="No plans yet" style={{ marginTop: 16, color: colors.textPrimary }} />
              <Tree title={`You don't have any plans in '${activeTab}'`} style={{ color: colors.textSecondary, marginTop: 8 }} />
            </View>
          }
          ListFooterComponent={
            !isSelectionMode ? (
              <AppButton
                title="Add New Plan"
                icon={IconPlus}
                onPress={openAddModal}
                style={{ marginTop: filteredPlans.length > 0 ? 0 : 24, borderRadius: 16, width: '100%' }}
              />
            ) : (
              <View style={[styles.selectionBarList, { marginTop: filteredPlans.length > 0 ? 0 : 24 }]}>
                <Text style={{ color: colors.textPrimary, fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, textAlign: 'center', marginBottom: 12 }}>
                  {selectedIds.length} Plans Selected
                </Text>
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <AppButton title="Status" icon={IconCheck} onPress={() => setBulkStatusVisible(true)} style={{ width: '100%' }} />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <AppButton title="Delete" icon={IconTrash} variant="destructive" onPress={() => setDeleteConfirmId('bulk')} style={{ width: '100%' }} />
                  </View>
                </View>

                <View style={{ height: 12 }} />
                
                <AppButton title="Cancel Selection" icon={IconX} variant="secondary" onPress={() => setSelectedIds([])} style={{ width: '100%' }} />
              </View>
            )
          }
          renderItem={({ item }) => (
            <PlanCard 
              item={item} 
              colors={colors} 
              activeTheme={activeTheme} 
              handleDelete={handleDelete} 
              openEditModal={openEditModal} 
              changeStatusImmediate={changeStatusImmediate} 
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={() => {
                if (selectedIds.includes(item.id)) setSelectedIds(selectedIds.filter(id => id !== item.id));
                else setSelectedIds([...selectedIds, item.id]);
              }}
              onLongPress={() => {
                if (!selectedIds.includes(item.id)) setSelectedIds([...selectedIds, item.id]);
              }}
            />
          )}
        />
      </View>

      <Modal 
        visible={modalVisible} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={() => setModalVisible(false)}
        onShow={() => {
          setTimeout(() => {
            titleInputRef.current?.focus();
          }, 100);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Mountain title={editingId ? "Edit Plan" : "New Plan"} style={{ fontSize: 20, color: colors.textPrimary }} />
              <Pressable onPress={() => setModalVisible(false)}>
                <IconX size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            
            <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                ref={titleInputRef}
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="Plan Title (e.g., Read Chapter 4)"
                placeholderTextColor={colors.textSecondary}
                value={tempTitle}
                onChangeText={setTempTitle}
              />
            </View>
            
            <View style={[styles.textAreaWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textArea, { color: colors.textPrimary }]}
                placeholder="Details (optional)"
                placeholderTextColor={colors.textSecondary}
                value={tempDetails}
                onChangeText={setTempDetails}
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.iconSelector}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Choose Icon</Text>
              
              <View style={{ flexDirection: 'column', gap: 12 }}>
                {/* First Row: 5 icons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {availableIcons.slice(0, 5).map(iconItem => {
                    const IconComp = iconItem.component;
                    const isSelected = tempIcon === iconItem.id;
                    return (
                      <Pressable
                        key={iconItem.id}
                        onPress={() => setTempIcon(iconItem.id)}
                        style={[
                          styles.iconOption,
                          { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                          isSelected && { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderWidth: 2 }
                        ]}
                      >
                        <IconComp size={24} color={isSelected ? colors.accent : colors.textSecondary} />
                      </Pressable>
                    );
                  })}
                </View>

                {/* Second Row: 5 icons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {availableIcons.slice(5, 10).map(iconItem => {
                    const IconComp = iconItem.component;
                    const isSelected = tempIcon === iconItem.id;
                    return (
                      <Pressable
                        key={iconItem.id}
                        onPress={() => setTempIcon(iconItem.id)}
                        style={[
                          styles.iconOption,
                          { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                          isSelected && { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderWidth: 2 }
                        ]}
                      >
                        <IconComp size={24} color={isSelected ? colors.accent : colors.textSecondary} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.statusSelector}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Choose Status</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {tabs.filter(t => t !== 'All').map(tab => {
                  const isSelected = tempStatus === tab;
                  return (
                    <Pressable
                      key={tab}
                      style={[
                        styles.statusTab,
                        { backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                        isSelected && { backgroundColor: colors.accent }
                      ]}
                      onPress={() => setTempStatus(tab)}
                    >
                      <Text style={[
                        styles.statusTabText,
                        { color: colors.textPrimary },
                        isSelected && { color: '#FFF' }
                      ]}>
                        {tab}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <AppButton title="Save Plan" onPress={handleSave} style={{ width: '100%', borderRadius: 16, marginTop: 10 }} />
          </View>
        </View>
      </Modal>



      <Modal visible={deleteConfirmId !== null} transparent={true} animationType="fade" onRequestClose={() => setDeleteConfirmId(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.glowingWrapper}>
            <LinearGradient
                colors={[colors.destructive, colors.destructive + '30']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={[styles.innerGlowCard, { backgroundColor: activeTheme === 'dark' ? '#0F1A24' : '#FFFFFF' }]}>
                    <View style={[styles.modalIconWrap, { backgroundColor: colors.destructive + '20', alignSelf: 'center' }]}>
                        <IconTrash size={32} color={colors.destructive} />
                    </View>
                    <Mountain title="Delete Plan?" style={[styles.modalTitleConfirm, { color: colors.textPrimary }]} />
                    <Text style={[styles.modalTextConfirm, { color: colors.textSecondary }]}>
                        {deleteConfirmId === 'bulk' ? `Are you sure you want to delete these ${selectedIds.length} plans? This action cannot be undone.` : 'Are you sure you want to delete this plan? This action cannot be undone.'}
                    </Text>
                    <View style={styles.actionGridInner}>
                        <AppButton 
                            title="Yes, Delete it" 
                            icon={IconTrash} 
                            onPress={confirmDelete} 
                            style={[styles.fullWidthButton, { backgroundColor: colors.destructive }]} 
                        />
                        <AppButton 
                            title="Cancel" 
                            icon={IconX} 
                            variant="secondary" 
                            onPress={() => setDeleteConfirmId(null)} 
                            style={styles.fullWidthButton} 
                        />
                    </View>
                </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      <Header title="Reading Plans" />



      {/* Bulk Status Modal */}
      <Modal visible={bulkStatusVisible} transparent={true} animationType="fade" onRequestClose={() => setBulkStatusVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border, padding: 24 }]}>
            <Mountain title="Change Status" style={{ fontSize: 20, color: colors.textPrimary, marginBottom: 16, textAlign: 'center' }} />
            <Text style={{ color: colors.textSecondary, fontFamily: 'SpaceGrotesk-Medium', textAlign: 'center', marginBottom: 24 }}>
              Move {selectedIds.length} plans to...
            </Text>
            
            <View style={{ gap: 12 }}>
              {tabs.filter(t => t !== 'All').map(status => (
                <AppButton 
                  key={status}
                  title={status} 
                  variant="semi"
                  style={{ backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  onPress={() => {
                    setConfirmAction({ id: 'bulk', newStatus: status });
                    confirmStatusChange();
                  }} 
                />
              ))}
              <AppButton 
                title="Cancel" 
                variant="semi" 
                style={{ marginTop: 8 }}
                onPress={() => setBulkStatusVisible(false)} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1 },
  tabsWrapper: {
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 160,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 4,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    marginBottom: 2,
  },
  emailText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
    marginBottom: 2,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 11,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  drawerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 1,
    overflow: 'hidden',
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 18,
    position: 'relative',
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 2,
  },
  segmentedSlider: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    width: '33.33%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  segmentedButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 11,
  },
  selectionBarList: {
    paddingVertical: 16,
    width: '100%',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitleConfirm: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalTextConfirm: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  glowingWrapper: {
    width: '100%',
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 20,
  },
  innerGlowCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  actionGridInner: {
    width: '100%',
    gap: 12,
  },
  fullWidthButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 54,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
  textAreaWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 120,
  },
  textArea: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    flex: 1,
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusTabText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 13,
  },
  statusText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 12,
  },
  iconSelector: {
    marginBottom: 16,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    marginBottom: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
