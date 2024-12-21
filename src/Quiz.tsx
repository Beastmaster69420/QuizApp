import React, { useEffect, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';

export interface IRoot {
  response_code: number;
  results: IResult[];
}

export interface IResult {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const MAX_ROUND = 20;

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  GameOver: { correct: number; incorrect: number };
};

const Quiz = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Quiz'>>();
  const [answer, setAnswer] = useState<null | number>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [round, setRound] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (isGameOver) {
      navigation.navigate('GameOver', { correct: correctCount, incorrect: incorrectCount });
      return;
    }

    fetch('https://opentdb.com/api.php?amount=1')
      .then(response => response.json())
      .then((data: IRoot) => {
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setQuestion(result.question);
          setOptions([...result.incorrect_answers, result.correct_answer]);
        }
      })
      .catch(error => console.error('Error fetching quiz data:', error));
  }, [round, isGameOver]);

  const shuffledOptions = useMemo(() => shuffleArray(options), [options]);

  const handleAnswerSubmission = () => {
    if (answer !== null) {
      const isCorrect = shuffledOptions[answer] === options[options.length - 1];
      Alert.alert(isCorrect ? 'Correct!' : 'Wrong!');

      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      } else {
        setIncorrectCount(prev => prev + 1);
      }

      setAnswer(null);

      if (round >= MAX_ROUND) {
        setIsGameOver(true);
      } else {
        setRound(prevRound => prevRound + 1);
      }
    } else {
      Alert.alert('Please select an option!');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Text style={styles.roundValue}>Round {round}</Text>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>

        {shuffledOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              answer === index && styles.selectedButton,
            ]}
            onPress={() => setAnswer(index)}
            disabled={answer !== null} 
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAnswerSubmission}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.endGameButton}
        onPress={() => setIsGameOver(true)}
      >
        <Text style={styles.endGameText}>End Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  roundValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionButton: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#90caf9',
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    padding: 16,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endGameButton: {
    padding: 16,
    backgroundColor: '#f44336',
    borderRadius: 8,
    alignItems: 'center',
  },
  endGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Quiz;
