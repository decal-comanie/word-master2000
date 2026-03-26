import React, { useState, useEffect, useCallback } from "react";
import { ALL_WORDS } from "./data"; // 1. 파일 불러오기
import "./App.css";

// 2. 타이머 시간 설정 (여기만 수정하면 끝!)
const LIMIT_TIME = 5; // 5초로 설정 (원하는 초 단위 입력)

function App() {
  const [screen, setScreen] = useState("start");
  const [quizList, setQuizList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [answeredIdx, setAnsweredIdx] = useState(null);
  const [correctIdx, setCorrectIdx] = useState(null);

  const startQuiz = () => {
    if (ALL_WORDS.length < 5) return alert("데이터가 부족합니다.");
    const shuffled = [...ALL_WORDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 500);
    setQuizList(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setHistory([]);
    setScreen("quiz");
  };

  const setupQuestion = useCallback(() => {
    if (currentIdx >= quizList.length) {
      setScreen("result");
      return;
    }
    setIsLocked(false);
    setAnsweredIdx(null);
    setCorrectIdx(null);
    setTimeLeft(100);

    const currentWord = quizList[currentIdx];
    let options = [currentWord.kor];
    while (options.length < 4) {
      const randomWord =
        ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)].kor;
      if (!options.includes(randomWord)) options.push(randomWord);
    }
    setChoices(options.sort(() => Math.random() - 0.5));
  }, [currentIdx, quizList]);

  useEffect(() => {
    if (screen === "quiz") setupQuestion();
  }, [screen, setupQuestion]);

  // 3. 타이머 로직 수정 (LIMIT_TIME 반영)
  useEffect(() => {
    if (screen !== "quiz" || isLocked) return;

    // 10ms마다 줄어들게 계산 (더 부드러운 애니메이션)
    const tick = 10;
    const totalMs = LIMIT_TIME * 1000;
    const decrement = (tick / totalMs) * 100;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleAnswer(-1);
          return 0;
        }
        return prev - decrement;
      });
    }, tick);

    return () => clearInterval(timer);
  }, [screen, isLocked]);

  const handleAnswer = (idx) => {
    if (isLocked) return;
    setIsLocked(true);

    const currentWord = quizList[currentIdx];
    const correctOptionIdx = choices.indexOf(currentWord.kor);
    setCorrectIdx(correctOptionIdx);
    setAnsweredIdx(idx);

    const isRight = idx !== -1 && choices[idx] === currentWord.kor;
    if (isRight) setScore((s) => s + 1);

    setHistory((prev) => [...prev, { ...currentWord, isRight }]);

    setTimeout(() => {
      setCurrentIdx((prev) => prev + 1);
    }, 600);
  };
  // 개발자 스킵
  const skipToResult = () => {
    const remain = quizList.length - history.length;
    const padding = Array(remain)
      .fill(0)
      .map((_, i) => ({ ...quizList[history.length + i], isRight: false }));
    setHistory((prev) => [...prev, ...padding]);
    setScreen("result");
  };

  if (screen === "start") {
    return (
      <div id="app">
        <h1 style={{ marginTop: 0 }}>Word 500</h1>
        <p style={{ color: "#666", lineHeight: "1.5" }}>
          2,000단어 중 500문제가 출제됩니다.
          <br />
          <b>한 문제당 제한시간 2초!</b>
        </p>
        <button className="main-btn" onClick={startQuiz}>
          테스트 시작
        </button>
      </div>
    );
  }

  if (screen === "quiz") {
    return (
      <div id="app">
        <div className="stats">
          <span>
            Q: <b>{currentIdx + 1}</b> / 500
          </span>
          <button className="dev-btn" onClick={skipToResult}>
            [SKIP]
          </button>
          <span>
            Score: <b>{score}</b>
          </span>
        </div>
        <div id="timer-container">
          <div
            id="timer-bar"
            style={{
              width: `${timeLeft}%`,
              transition: timeLeft === 100 ? "none" : "linear 10ms",
            }}
          ></div>
        </div>
        <div className="word-display">{quizList[currentIdx]?.eng}</div>
        <div className="options-grid">
          {choices.map((txt, i) => {
            let btnClass = "option-btn";
            if (isLocked) {
              if (i === correctIdx) btnClass += " correct";
              else if (i === answeredIdx) btnClass += " wrong";
              else if (answeredIdx === -1 && i === correctIdx)
                btnClass += " timeout";
            }
            return (
              <button
                key={i}
                className={btnClass}
                onClick={() => handleAnswer(i)}
                disabled={isLocked}
              >
                {txt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div id="app">
      <h2 style={{ marginTop: 0 }}>TEST RESULT</h2>
      <div
        style={{
          fontSize: "22px",
          color: "#1a73e8",
          marginBottom: "15px",
          fontWeight: 800,
        }}
      >
        SCORE: {score} / 500
      </div>
      <button
        className="main-btn"
        style={{ background: "#666", padding: "12px" }}
        onClick={() => window.location.reload()}
      >
        RETRY (RESET)
      </button>
      <div className="result-container">
        {history.map((item, i) => (
          <div
            key={i}
            className={`result-card ${item.isRight ? "res-correct-card" : "res-wrong-card"}`}
          >
            <div className="card-num">#{i + 1}</div>
            <div className="card-eng">{item.eng}</div>
            <div className="card-kor">{item.kor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
