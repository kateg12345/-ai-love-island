'use client';

import { useState, useEffect } from 'react';
import './globals.css';

// NPC 数据类型
interface NPC {
  id: number;
  name: string;
  profession: string;
  mbti: string;
  zodiac: string;
  interests: string[];
  socialValue: number; // 隐藏，玩家看不到
  gender: 'M' | 'F';
  relationshipStatus: 'single' | 'dating' | 'coupled';
  currentPartner: number | null;
  relationshipProgress: number; // 0-100
}

// 玩家数据
interface Player {
  name: string;
  profession: string;
  mbti: string;
  zodiac: string;
  socialValue: number;
  targetNPC: number | null;
  relationshipProgress: number;
  relationshipStatus: 'single' | 'dating' | 'coupled';
}

// 事件日志
interface GameEvent {
  day: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

// 12 个预设 NPC
const initialNPCs: NPC[] = [
  { id: 1, name: 'Alice CEO', profession: 'CEO', mbti: 'ENTJ', zodiac: 'Leo', interests: ['Business', 'Travel'], socialValue: 110, gender: 'F', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 2, name: 'Bob Artist', profession: 'Artist', mbti: 'ENFP', zodiac: 'Pisces', interests: ['Art', 'Music'], socialValue: 100, gender: 'M', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 3, name: 'Carol Engineer', profession: 'Engineer', mbti: 'INTJ', zodiac: 'Virgo', interests: ['Tech', 'Gaming'], socialValue: 95, gender: 'F', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 4, name: 'David Lawyer', profession: 'Lawyer', mbti: 'ENFJ', zodiac: 'Libra', interests: ['Law', 'Wine'], socialValue: 85, gender: 'M', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 5, name: 'Emma Photographer', profession: 'Photographer', mbti: 'ISFP', zodiac: 'Sagittarius', interests: ['Travel', 'Art'], socialValue: 80, gender: 'F', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 6, name: 'Frank Doctor', profession: 'Doctor', mbti: 'ISTJ', zodiac: 'Capricorn', interests: ['Medicine', 'Running'], socialValue: 75, gender: 'M', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 7, name: 'Grace Writer', profession: 'Writer', mbti: 'INFP', zodiac: 'Cancer', interests: ['Books', 'Coffee'], socialValue: 65, gender: 'F', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 8, name: 'Henry Teacher', profession: 'Teacher', mbti: 'ESFJ', zodiac: 'Taurus', interests: ['Education', 'Hiking'], socialValue: 60, gender: 'M', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 9, name: 'Ivy Musician', profession: 'Musician', mbti: 'ISTP', zodiac: 'Aquarius', interests: ['Music', 'Cats'], socialValue: 55, gender: 'F', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 10, name: 'Jack Barista', profession: 'Barista', mbti: 'INTP', zodiac: 'Gemini', interests: ['Coffee', 'Philosophy'], socialValue: 48, gender: 'M', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 11, name: 'Kate Retail', profession: 'Retail Worker', mbti: 'ESFP', zodiac: 'Aries', interests: ['Fashion', 'Dance'], socialValue: 45, gender: 'F', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
  { id: 12, name: 'Leo Poet', profession: 'Poet', mbti: 'INFJ', zodiac: 'Scorpio', interests: ['Poetry', 'Nature'], socialValue: 42, gender: 'M', relationshipStatus: 'single', currentPartner: null, relationshipProgress: 0 },
];

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [npcs, setNPCs] = useState<NPC[]>(initialNPCs);
  const [player, setPlayer] = useState<Player>({
    name: 'You',
    profession: 'Designer',
    mbti: 'ENFP',
    zodiac: 'Leo',
    socialValue: 70, // 玩家初始价值
    targetNPC: null,
    relationshipProgress: 0,
    relationshipStatus: 'single',
  });
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [selectedNPC, setSelectedNPC] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 时间推进：5分钟 = 1天（300秒 = 1天，所以每秒触发一次检查）
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const dayDuration = 300000; // 5分钟 = 300,000毫秒
    const interval = setInterval(() => {
      setCurrentDay((prev) => {
        const newDay = prev + 1;
        if (newDay > 30) {
          setGameOver(true);
          setShowResults(true);
          return 30;
        }
        
        // 每天触发 NPC 自主行动
        triggerNPCActions(newDay);
        
        addEvent(newDay, `📅 Day ${newDay} begins`, 'info');
        return newDay;
      });
    }, dayDuration);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // NPC 自主行动（每天触发）
  const triggerNPCActions = (day: number) => {
    setNPCs((prevNPCs) => {
      const updatedNPCs = [...prevNPCs];
      
      updatedNPCs.forEach((npc, index) => {
        // 30% 概率主动邀请约会（如果单身）
        if (npc.relationshipStatus === 'single' && Math.random() < 0.3) {
          const potentialPartners = updatedNPCs.filter(
            (other) => 
              other.id !== npc.id && 
              other.gender !== npc.gender && 
              other.relationshipStatus === 'single'
          );
          
          if (potentialPartners.length > 0) {
            // 选择社会价值最接近的
            potentialPartners.sort((a, b) => 
              Math.abs(a.socialValue - npc.socialValue) - 
              Math.abs(b.socialValue - npc.socialValue)
            );
            
            const target = potentialPartners[0];
            const valueGap = Math.abs(npc.socialValue - target.socialValue);
            const acceptProb = Math.exp(-valueGap / 15);
            
            if (Math.random() < acceptProb) {
              // 接受约会
              updatedNPCs[index].relationshipStatus = 'dating';
              updatedNPCs[index].currentPartner = target.id;
              updatedNPCs[index].relationshipProgress = 20;
              
              const targetIndex = updatedNPCs.findIndex((n) => n.id === target.id);
              if (targetIndex !== -1) {
                updatedNPCs[targetIndex].relationshipStatus = 'dating';
                updatedNPCs[targetIndex].currentPartner = npc.id;
                updatedNPCs[targetIndex].relationshipProgress = 20;
                
                addEvent(day, `💕 ${npc.name} started dating ${target.name}`, 'success');
              }
            }
          }
        }
        
        // 已经在约会的，关系可能进展或分手
        if (npc.relationshipStatus === 'dating' && npc.currentPartner) {
          if (Math.random() < 0.2) {
            // 20% 概率关系进展
            updatedNPCs[index].relationshipProgress += 15;
            
            if (updatedNPCs[index].relationshipProgress >= 70) {
              updatedNPCs[index].relationshipStatus = 'coupled';
              const partnerIndex = updatedNPCs.findIndex((n) => n.id === npc.currentPartner);
              if (partnerIndex !== -1) {
                updatedNPCs[partnerIndex].relationshipStatus = 'coupled';
                addEvent(day, `💍 ${npc.name} and ${updatedNPCs[partnerIndex].name} are now a couple!`, 'success');
              }
            }
          } else if (Math.random() < 0.1) {
            // 10% 概率分手
            const partnerIndex = updatedNPCs.findIndex((n) => n.id === npc.currentPartner);
            if (partnerIndex !== -1) {
              addEvent(day, `💔 ${npc.name} and ${updatedNPCs[partnerIndex].name} broke up`, 'warning');
              
              updatedNPCs[partnerIndex].relationshipStatus = 'single';
              updatedNPCs[partnerIndex].currentPartner = null;
              updatedNPCs[partnerIndex].relationshipProgress = 0;
            }
            
            updatedNPCs[index].relationshipStatus = 'single';
            updatedNPCs[index].currentPartner = null;
            updatedNPCs[index].relationshipProgress = 0;
          }
        }
      });
      
      return updatedNPCs;
    });
  };

  // 添加事件日志
  const addEvent = (day: number, message: string, type: 'info' | 'success' | 'warning') => {
    setEvents((prev) => [...prev, { day, message, type }].slice(-10)); // 只保留最近10条
  };

  // 玩家行动：认识 NPC
  const meetNPC = (npcId: number) => {
    const npc = npcs.find((n) => n.id === npcId);
    if (npc) {
      addEvent(currentDay, `👋 You met ${npc.name} (${npc.profession})`, 'info');
      setSelectedNPC(npcId);
    }
  };

  // 玩家行动：邀请约会
  const inviteDate = (npcId: number) => {
    const npc = npcs.find((n) => n.id === npcId);
    if (!npc) return;

    if (npc.relationshipStatus !== 'single') {
      addEvent(currentDay, `❌ ${npc.name} is already in a relationship`, 'warning');
      return;
    }

    const valueGap = Math.abs(player.socialValue - npc.socialValue);
    const acceptProb = Math.exp(-valueGap / 15);

    if (Math.random() < acceptProb) {
      // 接受
      setPlayer((prev) => ({
        ...prev,
        targetNPC: npcId,
        relationshipProgress: 20,
        relationshipStatus: 'dating',
      }));

      setNPCs((prevNPCs) =>
        prevNPCs.map((n) =>
          n.id === npcId
            ? { ...n, relationshipStatus: 'dating', currentPartner: -1, relationshipProgress: 20 }
            : n
        )
      );

      addEvent(currentDay, `💕 ${npc.name} accepted your date!`, 'success');
    } else {
      addEvent(currentDay, `😔 ${npc.name} rejected you`, 'warning');
    }
  };

  // 玩家行动：维持关系
  const maintainRelationship = () => {
    if (!player.targetNPC) return;

    setPlayer((prev) => ({
      ...prev,
      relationshipProgress: Math.min(prev.relationshipProgress + 10, 100),
    }));

    if (player.relationshipProgress >= 70 && player.relationshipStatus === 'dating') {
      setPlayer((prev) => ({ ...prev, relationshipStatus: 'coupled' }));
      addEvent(currentDay, `💍 You are now a couple!`, 'success');
    } else {
      addEvent(currentDay, `💬 You maintained your relationship`, 'info');
    }
  };

  // 计算最终分数
  const calculateFinalScore = () => {
    if (player.relationshipStatus === 'single' || !player.targetNPC) {
      return 0;
    }

    const partner = npcs.find((n) => n.id === player.targetNPC);
    if (!partner) return 0;

    return partner.socialValue - player.socialValue;
  };

  // 开始游戏
  const startGame = () => {
    setGameStarted(true);
    setCurrentDay(1);
    setNPCs(initialNPCs);
    setEvents([]);
    addEvent(1, '🎮 Game started! You have 30 days to find love.', 'info');
  };

  // 重新开始
  const restartGame = () => {
    setGameStarted(false);
    setCurrentDay(1);
    setNPCs(initialNPCs);
    setPlayer({
      name: 'You',
      profession: 'Designer',
      mbti: 'ENFP',
      zodiac: 'Leo',
      socialValue: 70,
      targetNPC: null,
      relationshipProgress: 0,
      relationshipStatus: 'single',
    });
    setEvents([]);
    setGameOver(false);
    setShowResults(false);
    setSelectedNPC(null);
  };

  if (!gameStarted) {
    return (
      <div className="container start-screen">
        <h1 className="pixel-title">30 DAYS ON LOVE ISLAND</h1>
        <p className="pixel-text">You have 30 days to find love.</p>
        <p className="pixel-text">Can you date someone above your league?</p>
        <button className="pixel-button" onClick={startGame}>
          START GAME
        </button>
      </div>
    );
  }

  if (showResults) {
    const finalScore = calculateFinalScore();
    const partner = player.targetNPC ? npcs.find((n) => n.id === player.targetNPC) : null;

    return (
      <div className="container results-screen">
        <h1 className="pixel-title">GAME OVER</h1>
        <div className="results-box">
          <h2>DAY 30 RESULTS</h2>
          
          {player.relationshipStatus === 'single' ? (
            <p className="pixel-text">💔 You stayed single.</p>
          ) : (
            <>
              <p className="pixel-text">💕 You ended up with {partner?.name}</p>
              <p className="pixel-text">Your Social Value: {player.socialValue}</p>
              <p className="pixel-text">Partner Social Value: {partner?.socialValue}</p>
              <h3 className={finalScore > 0 ? 'score-positive' : finalScore < 0 ? 'score-negative' : 'score-neutral'}>
                FINAL SCORE: {finalScore > 0 ? '+' : ''}{finalScore}
              </h3>
              {finalScore > 20 && <p className="pixel-text">🏆 Amazing upset! You dated up!</p>}
              {finalScore >= 0 && finalScore <= 20 && <p className="pixel-text">✅ Balanced relationship</p>}
              {finalScore < 0 && <p className="pixel-text">📉 You dated down</p>}
            </>
          )}

          <h3>HIDDEN VALUES REVEALED</h3>
          <div className="npc-values-grid">
            {npcs.map((npc) => (
              <div key={npc.id} className="npc-value-card">
                <div className="npc-name">{npc.name}</div>
                <div className="npc-value">Value: {npc.socialValue}</div>
                <div className="npc-status">
                  {npc.relationshipStatus === 'coupled' ? '💍' : npc.relationshipStatus === 'dating' ? '💕' : '💔'}
                </div>
              </div>
            ))}
          </div>

          <button className="pixel-button" onClick={restartGame}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container game-screen">
      {/* 顶部状态栏 */}
      <div className="status-bar">
        <div className="day-counter">DAY {currentDay} / 30</div>
        <div className="player-status">
          {player.relationshipStatus === 'single' && '💔 Single'}
          {player.relationshipStatus === 'dating' && '💕 Dating'}
          {player.relationshipStatus === 'coupled' && '💍 Coupled'}
        </div>
        <div className="time-info">⏱ 5 min = 1 day</div>
      </div>

      {/* 主游戏区域 */}
      <div className="game-area">
        {/* NPC 网格 */}
        <div className="npc-grid">
          {npcs.map((npc) => (
            <div
              key={npc.id}
              className={`npc-card ${selectedNPC === npc.id ? 'selected' : ''} ${
                npc.relationshipStatus === 'coupled' ? 'coupled' : 
                npc.relationshipStatus === 'dating' ? 'dating' : ''
              }`}
              onClick={() => meetNPC(npc.id)}
            >
              <div className="npc-avatar">{npc.gender === 'M' ? '👨' : '👩'}</div>
              <div className="npc-name">{npc.name}</div>
              <div className="npc-profession">{npc.profession}</div>
              <div className="npc-status">
                {npc.relationshipStatus === 'coupled' ? '💍' : 
                 npc.relationshipStatus === 'dating' ? '💕' : 
                 '💔'}
              </div>
              {npc.currentPartner && npc.currentPartner !== -1 && (
                <div className="npc-partner-info">
                  with {npcs.find((n) => n.id === npc.currentPartner)?.name}
                </div>
              )}
              {player.targetNPC === npc.id && (
                <div className="player-relationship-badge">YOUR DATE</div>
              )}
            </div>
          ))}
        </div>

        {/* 行动面板 */}
        <div className="action-panel">
          <h3>ACTIONS</h3>
          {selectedNPC ? (
            <>
              <p className="selected-npc-name">
                Selected: {npcs.find((n) => n.id === selectedNPC)?.name}
              </p>
              <button
                className="pixel-button"
                onClick={() => inviteDate(selectedNPC)}
                disabled={player.relationshipStatus !== 'single'}
              >
                💕 INVITE DATE
              </button>
            </>
          ) : (
            <p className="pixel-text">Click an NPC to interact</p>
          )}

          {player.targetNPC && (
            <button
              className="pixel-button"
              onClick={maintainRelationship}
            >
              💬 MAINTAIN RELATIONSHIP
            </button>
          )}

          {player.targetNPC && (
            <div className="relationship-progress">
              <p>Relationship Progress:</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${player.relationshipProgress}%` }}
                />
              </div>
              <p>{player.relationshipProgress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* 事件日志 */}
      <div className="event-log">
        <h3>📜 RECENT EVENTS</h3>
        <div className="event-list">
          {events.slice().reverse().map((event, index) => (
            <div key={index} className={`event-item event-${event.type}`}>
              <span className="event-day">Day {event.day}:</span> {event.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
