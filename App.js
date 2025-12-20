import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  AppState,
  Dimensions,
  FlatList
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
  const [expandedDescription, setExpandedDescription] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const slideInterval = useRef(null);
  const appState = useRef(AppState.currentState);

  // Коллекция изображений Dmitry NE (9 картинок)
  const dmitryNEImages = [
    { id: 1, url: 'https://i.ibb.co/XZrmBtGW/dn.png' }, // Ваше основное изображение
    { id: 2, url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop' }, // Музыкальная тематика
    { id: 3, url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w-800&auto=format&fit=crop' }, // Концерт
    { id: 4, url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&auto=format&fit=crop' }, // Музыкальный инструмент
    { id: 5, url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop' }, // Звуковая студия
    { id: 6, url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop' }, // Ночной город
    { id: 7, url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop' }, // Атмосфера
    { id: 8, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop' }, // DJ
    { id: 9, url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop' }, // Музыкальная душа
  ];

  // Плейлист с треками Dmitry NE и описаниями
  const playlist = [
    {
      id: 1,
      title: 'White Night',
      artist: 'Dmitry NE',
      url: 'https://storage1.lightaudio.ru/dm/121899d0/13c9cdcf/Dmitry%20NE%20%E2%80%94%20white%20night.mp3?d=94&v=81a0b660ee',
      image: 'https://i.ibb.co/XZrmBtGW/dn.png',
      description: 'Мелодичная электронная композиция с атмосферными звуками белых ночей. Идеально подходит для медитации и расслабления.',
      duration: '3:45',
      year: '2020'
    },
    {
      id: 2,
      title: 'Yeux de la couleur du ciel',
      artist: 'Dmitry NE',
      url: 'https://song.muzvibe.org/download/3336373437313531338b3731353333303035370400/7c75bd77a683c656a51ffac4d2bc8da6/Dmitry%20NE%20-%20Yeux%20de%20la%20couleur%20du%20ciel.mp3',
      image: 'https://i.ibb.co/XZrmBtGW/dn.png',
      description: 'Поэтичная композиция с французским названием "Глаза цвета неба". Сочетание электронных битов и лирических мелодий.',
      duration: '4:20',
      year: '2019'
    },
    {
      id: 3,
      title: 'Nelire 3 (2017)',
      artist: 'Dmitry NE',
      url: 'https://song.muzvibe.org/download/33b434343536b5b0348d3731353332b63430360700/7c75bd77a683c656a51ffac4d2bc8da6/Dmitry%20NE%20-%20nelire%203%20%27%202017.mp3',
      image: 'https://i.ibb.co/XZrmBtGW/dn.png',
      description: 'Экспериментальный трек из серии Nelire. Сложные ритмические структуры и необычные звуковые эффекты.',
      duration: '5:15',
      year: '2017'
    },
    {
      id: 4,
      title: 'Je m\'ennuie de toi',
      artist: 'Dmitry NE',
      url: 'https://song.muzvibe.org/download/33343230b7343437b08837323335b534b434b00400/7c75bd77a683c656a51ffac4d2bc8da6/Dmitry%20NE%20-%20je%20m%27ennuie%20de%20toi.mp3',
      image: 'https://i.ibb.co/XZrmBtGW/dn.png',
      description: 'Лирическая композиция с французским названием "Я скучаю по тебе". Эмоциональный электронный трек с вокальными сэмплами.',
      duration: '3:55',
      year: '2021'
    },
    {
      id: 5,
      title: 'Moon Angel',
      artist: 'Dmitry NE',
      url: 'https://song.muzvibe.org/download/333435353137308b37313533323130b7340400/7c75bd77a683c656a51ffac4d2bc8da6/Dmitry%20NE%20-%20moon%20angel.mp3',
      image: 'https://i.ibb.co/XZrmBtGW/dn.png',
      description: 'Космическая атмосферная композиция. Звуки, напоминающие полет в лунном свете с ангельскими гармониями.',
      duration: '4:40',
      year: '2022'
    },
    {
      id: 6,
      title: 'ГИТАРА. Yeux de la couleur du ciel',
      artist: 'Dmitry NE',
      url: 'https://song.muzvibe.org/download/d335343031333534b488373235b03037b534300400/7c75bd77a683c656a51ffac4d2bc8da6/%D0%93%D0%98%D0%A2%D0%90%D0%A0%D0%90.%20Dmitry%20NE%20-%20yeux%20de%20la%20couleur%20du%20ciel.mp3',
      image: 'https://i.ibb.co/XZrmBtGW/dn.png',
      description: 'Акустическая версия известного трека с гитарным сопровождением. Более интимное и камерное звучание.',
      duration: '4:10',
      year: '2021'
    }
  ];

  // Настройка аудио сессии для фонового воспроизведения
  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    setupAudio();
  }, []);

  // Автопрокрутка изображений
  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  const startAutoSlide = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    
    slideInterval.current = setInterval(() => {
      setCurrentImageIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % dmitryNEImages.length;
        
        // Прокрутка FlatList
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 2000); // 2 секунды на картинку
  };

  const handleImageScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / slideSize);
    setCurrentImageIndex(index);
    
    // Перезапускаем таймер при ручной прокрутке
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    startAutoSlide();
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageSlide}>
      <Image 
        source={{ uri: item.url }} 
        style={styles.artistImage}
      />
      <View style={styles.imageOverlay}>
        <Text style={styles.imageText}>Dmitry NE</Text>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {dmitryNEImages.map((_, index) => (
        <View 
          key={index}
          style={[
            styles.dot,
            currentImageIndex === index ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );

  const playSound = async (track) => {
    try {
      setLoading(true);
      
      // Если уже играет тот же трек - пауза/продолжение
      if (sound && currentTrack?.id === track.id) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        setLoading(false);
        return;
      }

      // Если играет другой трек - остановить
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Создаем новый звуковой объект
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { 
          shouldPlay: true,
          isLooping: repeatMode === 'one'
        }
      );
      
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Обработчик событий воспроизведения
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          if (repeatMode === 'one') {
            return;
          } else if (repeatMode === 'all') {
            playNextTrack();
          } else {
            setIsPlaying(false);
          }
        }
      });
      
    } catch (error) {
      console.error('Ошибка воспроизведения:', error);
      Alert.alert('Ошибка', 'Не удалось воспроизвести трек. Проверьте интернет-соединение.');
    } finally {
      setLoading(false);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSound(playlist[nextIndex]);
  };

  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playSound(playlist[prevIndex]);
  };

  const toggleRepeatMode = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
    
    if (sound && modes[nextIndex] === 'one') {
      sound.setIsLoopingAsync(true);
    } else if (sound) {
      sound.setIsLoopingAsync(false);
    }
  };

  const toggleDescription = (trackId) => {
    setExpandedDescription(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'none': return 'repeat-outline';
      case 'one': return 'repeat';
      case 'all': return 'repeat';
      default: return 'repeat-outline';
    }
  };

  const getRepeatColor = () => {
    switch (repeatMode) {
      case 'none': return '#888';
      case 'one': return '#34C759';
      case 'all': return '#007AFF';
      default: return '#888';
    }
  };

  const getRepeatText = () => {
    switch (repeatMode) {
      case 'none': return 'Без повтора';
      case 'one': return 'Повтор трека';
      case 'all': return 'Повтор плейлиста';
      default: return 'Без повтора';
    }
  };

  // Очистка при закрытии
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  return (
    <ImageBackground 
      source={{ uri: 'https://i.ibb.co/XZrmBtGW/dn.png' }}
      style={styles.background}
      blurRadius={10}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Карусель изображений Dmitry NE */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={dmitryNEImages}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
              style={styles.carousel}
              initialScrollIndex={0}
              getItemLayout={(data, index) => ({
                length: width - 40,
                offset: (width - 40) * index,
                index,
              })}
            />
            {renderDots()}
          </View>

          {/* Заголовок */}
          <View style={styles.header}>
            <Ionicons name="musical-notes" size={40} color="rgba(255,255,255,0.9)" />
            <Text style={styles.title}>Dmitry NE</Text>
            <Text style={styles.subtitle}>Music Collection</Text>
            <Text style={styles.backgroundNote}>Автопрокрутка изображений каждые 2 секунды</Text>
          </View>
          
          {/* Режим повтора */}
          <TouchableOpacity 
            style={styles.repeatContainer}
            onPress={toggleRepeatMode}
          >
            <Ionicons 
              name={getRepeatIcon()} 
              size={28} 
              color={getRepeatColor()} 
            />
            <Text style={[styles.repeatText, { color: getRepeatColor() }]}>
              {getRepeatText()}
            </Text>
          </TouchableOpacity>

          {/* Текущий трек */}
          {currentTrack && (
            <View style={styles.currentTrackContainer}>
              <Image 
                source={{ uri: currentTrack.image }} 
                style={styles.currentTrackImage}
              />
              <View style={styles.currentTrackInfo}>
                <Text style={styles.currentTrackTitle} numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.currentTrackArtist}>{currentTrack.artist}</Text>
                <View style={styles.trackMeta}>
                  <Text style={styles.trackDuration}>{currentTrack.duration}</Text>
                  <Text style={styles.trackYear}>{currentTrack.year}</Text>
                </View>
                <View style={styles.statusContainer}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#34C759" />
                  ) : (
                    <Text style={styles.currentTrackStatus}>
                      {isPlaying ? '▶️ Сейчас играет' : '⏸️ На паузе'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Основные кнопки управления */}
          <View style={styles.mainControls}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.grayButton]}
              onPress={playPreviousTrack}
              disabled={!currentTrack || loading}
            >
              <Ionicons 
                name="play-skip-back" 
                size={35} 
                color={!currentTrack || loading ? "rgba(136,136,136,0.5)" : "rgba(255,255,255,0.9)"} 
              />
            </TouchableOpacity>
            
            {!isPlaying ? (
              <TouchableOpacity 
                style={[styles.controlButton, styles.grayPlayButton]}
                onPress={() => currentTrack ? playSound(currentTrack) : playSound(playlist[0])}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="rgba(255,255,255,0.9)" />
                ) : (
                  <Ionicons name="play" size={50} color="rgba(255,255,255,0.9)" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.controlButton, styles.grayPauseButton]}
                onPress={pauseSound}
              >
                <Ionicons name="pause" size={50} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.grayButton]}
              onPress={playNextTrack}
              disabled={!currentTrack || loading}
            >
              <Ionicons 
                name="play-skip-forward" 
                size={35} 
                color={!currentTrack || loading ? "rgba(136,136,136,0.5)" : "rgba(255,255,255,0.9)"} 
              />
            </TouchableOpacity>
          </View>

          {/* Вторичные кнопки управления */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity 
              style={[styles.secondaryButton, styles.grayButton]}
              onPress={stopSound}
              disabled={!sound || loading}
            >
              <Ionicons 
                name="stop" 
                size={25} 
                color={!sound || loading ? "rgba(136,136,136,0.5)" : "rgba(255,255,255,0.9)"} 
              />
              <Text style={styles.secondaryButtonText}>Стоп</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, styles.grayButton]}
              onPress={() => {
                if (sound && isPlaying) {
                  pauseSound();
                } else if (currentTrack) {
                  playSound(currentTrack);
                }
              }}
              disabled={!currentTrack && !sound}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={25} 
                color={!currentTrack && !sound ? "rgba(136,136,136,0.5)" : "rgba(255,255,255,0.9)"} 
              />
              <Text style={styles.secondaryButtonText}>
                {isPlaying ? 'Пауза' : 'Играть'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Плейлист */}
          <View style={styles.playlistContainer}>
            <View style={styles.playlistHeader}>
              <Text style={styles.playlistTitle}>Плейлист Dmitry NE</Text>
              <Text style={styles.playlistCount}>{playlist.length} треков</Text>
            </View>
            
            {playlist.map((track) => (
              <View key={track.id} style={styles.trackCard}>
                <TouchableOpacity
                  style={[
                    styles.trackItem,
                    currentTrack?.id === track.id && styles.activeTrackItem
                  ]}
                  onPress={() => playSound(track)}
                  disabled={loading}
                >
                  <View style={styles.trackNumberContainer}>
                    <Text style={[
                      styles.trackNumber,
                      currentTrack?.id === track.id && styles.activeTrackNumber
                    ]}>
                      {track.id}
                    </Text>
                  </View>
                  
                  <Image 
                    source={{ uri: track.image }} 
                    style={styles.trackImage}
                  />
                  
                  <View style={styles.trackInfo}>
                    <Text 
                      style={[
                        styles.trackTitle,
                        currentTrack?.id === track.id && styles.activeTrackTitle
                      ]}
                      numberOfLines={1}
                    >
                      {track.title}
                    </Text>
                    <Text style={styles.trackArtist}>{track.artist}</Text>
                    <View style={styles.trackMetaSmall}>
                      <Text style={styles.trackDurationSmall}>{track.duration}</Text>
                      <Text style={styles.trackYearSmall}>{track.year}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.trackStatus}>
                    {currentTrack?.id === track.id && isPlaying && (
                      <Ionicons name="volume-high" size={24} color="#34C759" />
                    )}
                    {currentTrack?.id === track.id && !isPlaying && !loading && (
                      <Ionicons name="pause-circle" size={24} color="#FF9500" />
                    )}
                    {loading && currentTrack?.id === track.id && (
                      <ActivityIndicator size="small" color="#FFF" />
                    )}
                  </View>
                </TouchableOpacity>
                
                {/* Описание трека */}
                <TouchableOpacity
                  style={styles.descriptionToggle}
                  onPress={() => toggleDescription(track.id)}
                >
                  <View style={styles.descriptionHeader}>
                    <Ionicons 
                      name={expandedDescription[track.id] ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="rgba(255,255,255,0.7)" 
                    />
                    <Text style={styles.descriptionToggleText}>
                      {expandedDescription[track.id] ? 'Скрыть описание' : 'Показать описание'}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {expandedDescription[track.id] && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {track.description}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Статистика */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Всего треков: {playlist.length} | Изображений: {dmitryNEImages.length}
            </Text>
            <Text style={styles.statsText} numberOfLines={2}>
              {currentTrack ? `Сейчас: ${currentTrack.title}` : 'Выберите трек для воспроизведения'}
            </Text>
            <Text style={styles.imageInfoText}>
              Изображение {currentImageIndex + 1} из {dmitryNEImages.length}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  carouselContainer: {
    width: width - 40,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  carousel: {
    flex: 1,
    borderRadius: 20,
  },
  imageSlide: {
    width: width - 40,
    height: 250,
    position: 'relative',
  },
  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
  },
  imageText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#34C759',
    width: 12,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 15,
    borderRadius: 20,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(221,221,221,0.8)',
    marginTop: 5,
    fontStyle: 'italic',
  },
  backgroundNote: {
    fontSize: 12,
    color: 'rgba(52, 199, 89, 0.8)',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  repeatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(60, 60, 70, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  repeatText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  currentTrackContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(40, 40, 50, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  currentTrackImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  currentTrackInfo: {
    flex: 1,
  },
  currentTrackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 8,
  },
  currentTrackArtist: {
    fontSize: 16,
    color: 'rgba(170,170,170,0.9)',
    marginBottom: 8,
  },
  trackMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  trackDuration: {
    fontSize: 14,
    color: 'rgba(136,136,136,0.9)',
    marginRight: 15,
  },
  trackYear: {
    fontSize: 14,
    color: 'rgba(136,136,136,0.9)',
  },
  statusContainer: {
    height: 24,
    justifyContent: 'center',
  },
  currentTrackStatus: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  controlButton: {
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  grayButton: {
    backgroundColor: 'rgba(100, 100, 110, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  grayPlayButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.7)',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  grayPauseButton: {
    backgroundColor: 'rgba(255, 149, 0, 0.7)',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 25,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 110, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  playlistContainer: {
    width: '100%',
    backgroundColor: 'rgba(40, 40, 50, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  playlistHeader: {
    marginBottom: 15,
    alignItems: 'center',
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 5,
    textAlign: 'center',
  },
  playlistCount: {
    fontSize: 14,
    color: 'rgba(170,170,170,0.8)',
    textAlign: 'center',
  },
  trackCard: {
    marginBottom: 12,
    backgroundColor: 'rgba(30, 30, 40, 0.6)',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  activeTrackItem: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderWidth: 2,
    borderColor: '#34C759',
  },
  trackNumberContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  trackNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(136,136,136,0.9)',
  },
  activeTrackNumber: {
    color: '#34C759',
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  activeTrackTitle: {
    color: '#34C759',
  },
  trackArtist: {
    fontSize: 12,
    color: 'rgba(187,187,187,0.8)',
    marginBottom: 4,
  },
  trackMetaSmall: {
    flexDirection: 'row',
  },
  trackDurationSmall: {
    fontSize: 11,
    color: 'rgba(136,136,136,0.8)',
    marginRight: 8,
  },
  trackYearSmall: {
    fontSize: 11,
    color: 'rgba(136,136,136,0.8)',
  },
  trackStatus: {
    width: 30,
    alignItems: 'center',
  },
  descriptionToggle: {
    padding: 10,
    backgroundColor: 'rgba(50, 50, 60, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionToggleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 6,
  },
  descriptionContainer: {
    padding: 12,
    backgroundColor: 'rgba(60, 60, 70, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  descriptionText: {
    color: 'rgba(221,221,221,0.9)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: 'rgba(170,170,170,0.8)',
    marginBottom: 4,
    textAlign: 'center',
  },
  imageInfoText: {
    fontSize: 11,
    color: 'rgba(136,136,136,0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
});