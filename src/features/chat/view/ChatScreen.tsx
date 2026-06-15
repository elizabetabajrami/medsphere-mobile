import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notificationSocketUrl } from '../../../network/apiClient';
import type { UserRole } from '../../auth/model/AuthTypes';
import type { ChatContact, ChatMessage } from '../model/Chat';
import { useChatViewModel } from '../viewmodel/useChatViewModel';

type ChatScreenProps = {
  role: UserRole;
};

export const ChatScreen = ({ role }: ChatScreenProps) => {
  const viewModel = useChatViewModel({ role });
  const messagesListRef = useRef<FlatList<ChatMessage>>(null);
  const [draft, setDraft] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const scrollToLatestMessage = useCallback((animated = true) => {
    if (viewModel.messages.length === 0) return;

    requestAnimationFrame(() => {
      messagesListRef.current?.scrollToEnd({ animated });
    });
  }, [viewModel.messages.length]);

  useEffect(() => {
    scrollToLatestMessage(false);
  }, [scrollToLatestMessage, viewModel.activeRoomId, viewModel.isMessagesLoading]);

  useEffect(() => {
    scrollToLatestMessage();
  }, [scrollToLatestMessage, viewModel.messages.length]);

  const send = () => {
    const value = draft.trim();
    if (!value) return;

    setDraft('');
    viewModel.sendMessage(value);
  };

  const pickPhoto = async () => {
    if (!viewModel.activeRoomId || viewModel.isUploadingImage) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to send an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      base64: true,
      mediaTypes: ['images'],
      quality: 0.65,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Photo not ready', 'Please choose another photo and try again.');
      return;
    }

    await viewModel.sendImage({
      fileName: asset.fileName || `chat-photo-${Date.now()}.jpg`,
      mimeType: asset.mimeType || 'image/jpeg',
      contentBase64: asset.base64,
    });
  };

  const activeTitle = viewModel.activeRoom
    ? viewModel.roomTitle(viewModel.activeRoom)
    : role === 'doctor'
      ? 'Choose a patient'
      : 'Choose a doctor';
  const activeSubtitle = viewModel.activeContact?.subtitle || (viewModel.activeRoom ? 'Direct message' : 'Start a conversation');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 84 : 0}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>{viewModel.isConnected ? 'Live chat' : 'Connecting to chat'}</Text>
          </View>
        </View>

        {viewModel.error ? <Text style={styles.error}>{viewModel.error}</Text> : null}

        <View style={styles.body}>
          <View style={styles.contactsPane}>
            {viewModel.contacts.length > 0 ? (
              <FlatList
                horizontal
                data={viewModel.contacts}
                keyExtractor={(contact) => contact.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contactsList}
                renderItem={({ item }) => (
                  <ContactChip
                    active={item.id === viewModel.activeParticipantId}
                    contact={item}
                    onPress={() => viewModel.startConversation(item)}
                  />
                )}
              />
            ) : (
              <Text style={styles.emptySmall}>
                {role === 'doctor' ? 'No patients available to message.' : 'No doctors available to message.'}
              </Text>
            )}
          </View>

          <View style={styles.thread}>
            <View style={styles.conversationHeader}>
              <View style={styles.conversationAvatar}>
                <Ionicons name={role === 'doctor' ? 'person-outline' : 'medical-outline'} size={22} color="#6B941F" />
              </View>
              <View style={styles.conversationCopy}>
                <Text style={styles.conversationTitle} numberOfLines={1}>{activeTitle}</Text>
                <Text style={styles.conversationSubtitle} numberOfLines={1}>{activeSubtitle}</Text>
              </View>
            </View>

            {viewModel.isMessagesLoading ? (
              <ActivityIndicator color="#6B941F" style={styles.loader} />
            ) : (
              <FlatList
                ref={messagesListRef}
                data={viewModel.messages}
                keyExtractor={(message) => message.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollToLatestMessage(false)}
                ListEmptyComponent={
                  <View style={styles.emptyThread}>
                    <Ionicons name="chatbubble-ellipses-outline" size={34} color="#6B941F" />
                    <Text style={styles.emptyTitle}>No messages yet</Text>
                    <Text style={styles.emptyText}>Start the conversation with a short message.</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <MessageBubble
                    message={item}
                    mine={item.senderId === viewModel.currentUserId}
                    onOpenImage={setPreviewImageUrl}
                  />
                )}
              />
            )}
          </View>
        </View>

        <View style={styles.composer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Upload photo"
            disabled={!viewModel.activeRoomId || viewModel.isUploadingImage}
            onPress={pickPhoto}
            style={[
              styles.photoButton,
              (!viewModel.activeRoomId || viewModel.isUploadingImage) && styles.photoButtonDisabled,
            ]}
          >
            {viewModel.isUploadingImage ? (
              <ActivityIndicator color="#6B941F" size="small" />
            ) : (
              <Ionicons name="image-outline" size={22} color="#6B941F" />
            )}
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor="#8A9582"
            multiline
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!draft.trim() || !viewModel.activeRoomId || viewModel.isSending}
            onPress={send}
            style={[
              styles.sendButton,
              (!draft.trim() || !viewModel.activeRoomId || viewModel.isSending) && styles.sendButtonDisabled,
            ]}
          >
            {viewModel.isSending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={Boolean(previewImageUrl)}
          onRequestClose={() => setPreviewImageUrl(null)}
        >
          <Pressable style={styles.previewBackdrop} onPress={() => setPreviewImageUrl(null)}>
            <Pressable style={styles.previewContent}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close image preview"
                onPress={() => setPreviewImageUrl(null)}
                style={styles.previewCloseButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>
              {previewImageUrl ? (
                <Image source={{ uri: previewImageUrl }} style={styles.previewImage} resizeMode="contain" />
              ) : null}
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ContactChip = ({
  active,
  contact,
  onPress,
}: {
  active: boolean;
  contact: ChatContact;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={[styles.contactChip, active && styles.contactChipActive]}
  >
    <Ionicons name={active ? 'chatbubble-ellipses' : 'person-add-outline'} size={16} color={active ? '#FFFFFF' : '#6B941F'} />
    <View style={styles.chipTextWrap}>
      <Text style={[styles.chipTitle, active && styles.chipTitleActive]} numberOfLines={1}>{contact.name}</Text>
      {contact.subtitle ? <Text style={[styles.chipSubtitle, active && styles.chipSubtitleActive]} numberOfLines={1}>{contact.subtitle}</Text> : null}
    </View>
  </Pressable>
);

const MessageBubble = ({
  message,
  mine,
  onOpenImage,
}: {
  message: ChatMessage;
  mine: boolean;
  onOpenImage: (url: string) => void;
}) => {
  const createdAt = new Date(message.createdAt);
  const time = Number.isNaN(createdAt.getTime())
    ? ''
    : createdAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const imageUrl = message.fileUrl
    ? new URL(message.fileUrl, notificationSocketUrl).toString()
    : null;

  return (
    <View style={[styles.messageRow, mine && styles.messageRowMine]}>
      <View style={[styles.bubble, mine && styles.bubbleMine]}>
        {message.type === 'image' && imageUrl ? (
          <>
            <Pressable accessibilityRole="imagebutton" onPress={() => onOpenImage(imageUrl)}>
              <Image source={{ uri: imageUrl }} style={styles.messageImage} resizeMode="cover" />
            </Pressable>
            <Text style={[styles.messageText, mine && styles.messageTextMine]}>{message.content}</Text>
          </>
        ) : (
          <Text style={[styles.messageText, mine && styles.messageTextMine]}>{message.content}</Text>
        )}
        <Text style={[styles.messageTime, mine && styles.messageTimeMine]}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: '#303A28',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 5,
  },
  error: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
  },
  contactsPane: {
    borderBottomColor: '#E8EEDF',
    borderBottomWidth: 1,
  },
  contactsList: {
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  contactChip: {
    width: 190,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  contactChipActive: {
    backgroundColor: '#6B941F',
    borderColor: '#6B941F',
  },
  chipTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  chipTitle: {
    color: '#303A28',
    fontSize: 13,
    fontWeight: '800',
  },
  chipTitleActive: {
    color: '#FFFFFF',
  },
  chipSubtitle: {
    color: '#66715E',
    fontSize: 11,
    marginTop: 3,
  },
  chipSubtitleActive: {
    color: '#EAF1E1',
  },
  thread: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  conversationHeader: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  conversationAvatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 14,
  },
  conversationCopy: {
    flex: 1,
    minWidth: 0,
  },
  conversationTitle: {
    color: '#303A28',
    fontSize: 16,
    fontWeight: '800',
  },
  conversationSubtitle: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  messagesList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#6B941F',
    borderColor: '#6B941F',
  },
  messageText: {
    color: '#303A28',
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  messageImage: {
    width: 210,
    height: 160,
    backgroundColor: '#F2F6EC',
    borderRadius: 14,
    marginBottom: 8,
  },
  messageTime: {
    color: '#66715E',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 5,
    textAlign: 'right',
  },
  messageTimeMine: {
    color: '#EAF1E1',
  },
  emptySmall: {
    color: '#66715E',
    fontSize: 13,
    paddingVertical: 18,
  },
  emptyThread: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#303A28',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8EEDF',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  photoButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAF5',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
  },
  photoButtonDisabled: {
    opacity: 0.45,
  },
  input: {
    flex: 1,
    maxHeight: 112,
    minHeight: 46,
    backgroundColor: '#F8FAF5',
    borderColor: '#DDE6D2',
    borderRadius: 18,
    borderWidth: 1,
    color: '#303A28',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  sendButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  loader: {
    paddingVertical: 16,
  },
  previewBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.88)',
    padding: 18,
  },
  previewContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCloseButton: {
    position: 'absolute',
    right: 4,
    top: 38,
    zIndex: 2,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
  },
  previewImage: {
    width: '100%',
    height: '82%',
  },
});
