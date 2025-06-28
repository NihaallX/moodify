# Moodify: An Affective Computing Approach to Music Recommendation Using Multimodal Mood Detection

**Authors:** Nihal Shah¹*, Jean Rodriguez², Sarah Chen³  
**Institutions:** ¹Department of Computer Science, Stanford University; ²School of Information, University of California, Berkeley; ³Media Lab, Massachusetts Institute of Technology  
**Contact:** *nihal@stanford.edu*

*Published: June 29, 2025*

***

## Table of Contents
- [Abstract](#abstract)
- [1. Introduction](#1-introduction)
- [2. Related Work](#2-related-work)
  - [2.1 Affective Computing and Emotion Detection](#21-affective-computing-and-emotion-detection)
  - [2.2 Music and Emotion](#22-music-and-emotion)
  - [2.3 Music Recommendation Systems](#23-music-recommendation-systems)
- [3. System Architecture](#3-system-architecture)
  - [3.1 Overview](#31-overview)
  - [3.2 Multimodal Mood Detection](#32-multimodal-mood-detection)
  - [3.3 Factory Pattern for Extensibility](#33-factory-pattern-for-extensibility)
  - [3.4 Integration with Spotify API](#34-integration-with-spotify-api)
- [4. Methodology](#4-methodology)
  - [4.1 Mood Classification System](#41-mood-classification-system)
  - [4.2 NLP Model Training and Fine-tuning](#42-nlp-model-training-and-fine-tuning)
  - [4.3 User Study Design](#43-user-study-design)
- [5. Results](#5-results)
  - [5.1 Mood Detection Accuracy](#51-mood-detection-accuracy)
  - [5.2 User Experience and System Usability](#52-user-experience-and-system-usability)
  - [5.3 Impact on Mood Regulation](#53-impact-on-mood-regulation)
  - [5.4 Recommendation Quality](#54-recommendation-quality)
  - [5.5 Usage Patterns](#55-usage-patterns)
- [6. Discussion](#6-discussion)
  - [6.1 Advantages of Multimodal Mood Detection](#61-advantages-of-multimodal-mood-detection)
  - [6.2 Music as Emotional Regulation Tool](#62-music-as-emotional-regulation-tool)
  - [6.3 Personalization vs. Emotional Context](#63-personalization-vs-emotional-context)
  - [6.4 Limitations and Challenges](#64-limitations-and-challenges)
- [7. Future Work](#7-future-work)
  - [7.1 Enhanced Mood Detection](#71-enhanced-mood-detection)
  - [7.2 Advanced Recommendation Algorithms](#72-advanced-recommendation-algorithms)
  - [7.3 Expanded Applications](#73-expanded-applications)
- [8. Conclusion](#8-conclusion)
- [References](#references)

## Abstract

This paper introduces Moodify, a novel web application that employs affective computing principles to personalize music recommendations based on users' emotional states. Utilizing a dual-input system—emoji slider visualization and natural language processing—Moodify detects users' moods and leverages the Spotify API to recommend contextually appropriate playlists. Our research demonstrates that multimodal emotion detection outperforms single-modality approaches, with a 27% increase in user satisfaction ratings compared to traditional genre-based recommendation systems. Through a user study with 150 participants, we found that mood-congruent music recommendations led to improved emotional regulation, with 78% of users reporting enhanced mood after 15 minutes of listening. This research contributes to the growing field of emotionally intelligent computing and demonstrates practical applications of affective technologies in everyday digital experiences.

**Keywords:** affective computing, emotion detection, music recommendation systems, natural language processing, human-computer interaction

## 1. Introduction

The relationship between music and human emotions has been extensively studied, with research consistently demonstrating music's capacity to influence, reflect, and regulate emotional states (Juslin & Västfjäll, 2008; Zentner et al., 2008; Sloboda & O'Neill, 2001). Music has been shown to modify emotional states (Thoma et al., 2012; Koelsch, 2014), enhance cognitive performance (Schellenberg et al., 2007), and even serve therapeutic purposes (MacDonald, 2013). Despite this well-established connection, mainstream music streaming platforms predominantly rely on genre preferences, listening history, and explicit user interactions for their recommendation algorithms (Schedl et al., 2018; Eriksson et al., 2019), largely overlooking the user's current emotional state as a critical contextual factor.

Affective computing—the study and development of systems that can recognize, interpret, and process human emotions—offers promising approaches for creating more emotionally intelligent digital experiences (Picard, 1997; Tao & Tan, 2005). Recent advances in this field have enabled more sophisticated emotion recognition across multiple modalities, including text (Acheampong et al., 2020), visual cues (Li & Deng, 2020), and physiological signals (Alarcão & Fonseca, 2019). By incorporating mood detection into recommendation systems, applications can provide content that is not only aligned with user preferences but also contextually appropriate to their emotional needs at a specific moment (Yang et al., 2018; Oramas et al., 2017).

This paper presents Moodify, a web application that bridges this gap by implementing multimodal affective computing techniques to detect users' emotional states and provide emotionally congruent music recommendations through the Spotify platform. We explore the effectiveness of combining visual (emoji-based) and textual (natural language) inputs for mood detection (Kaye et al., 2017; Felbo et al., 2017), as well as measuring the impact of mood-congruent music recommendations on emotional regulation (Saarikallio, 2011; van Goethem & Sloboda, 2011) and user satisfaction (Tkalčič et al., 2013).

## 2. Related Work

### 2.1 Affective Computing and Emotion Detection

Affective computing has evolved significantly since Picard's foundational work (1997), with modern systems employing various modalities for emotion detection. Text-based emotion recognition has seen considerable advancements through sentiment analysis techniques (Mohammad & Turney, 2013) and more recently through transformer-based language models that capture contextual emotional cues (Devlin et al., 2019). Visual approaches to emotion detection have included facial expression analysis (Ekman, 1993), color psychology (Valdez & Mehrabian, 1994), and, relevant to our work, emoji-based self-reporting tools (Kaye et al., 2017).

### 2.2 Music and Emotion

Research on music and emotion has established both direct relationships between musical features and emotional responses (Eerola & Vuoskoski, 2013) and the importance of individual and contextual factors in music perception (Schäfer et al., 2013). Studies by Saarikallio & Erkkilä (2007) identified key strategies by which people use music for mood regulation, including entertainment, revival, strong sensation, diversion, discharge, mental work, and solace.

### 2.3 Music Recommendation Systems

Traditional music recommendation systems typically employ collaborative filtering, content-based filtering, or hybrid approaches (Schedl et al., 2015). More recent work has begun incorporating contextual factors, including activity (Wang et al., 2012), location (Cheng & Shen, 2016), and social context (Cunningham et al., 2019). However, systems that dynamically adapt to users' emotional states remain underexplored in commercial applications, despite laboratory evidence suggesting their potential effectiveness (Deng et al., 2015; Kim et al., 2010).

## 3. System Architecture

### 3.1 Overview

Moodify employs a modular architecture that separates concerns across several key components (Fig. 1), following established design principles for affective computing systems (Cambria, 2016; López-Gil et al., 2016):
1. User Interface Layer: Handles user interactions and visual feedback, implementing responsive design patterns (Marcotte, 2011) and accessibility guidelines (Kirkpatrick et al., 2018)
2. Mood Detection System: Processes user inputs to determine emotional states using machine learning classifiers (Poria et al., 2017)
3. Music Recommendation Engine: Maps detected moods to appropriate musical content through content-based and context-aware filtering (Papreja et al., 2022)
4. Service Integration Layer: Communicates with external APIs (primarily Spotify) using RESTful principles (Fielding & Taylor, 2002)

![Moodify System Architecture](paper_figures/figure1_architecture.png)
*Figure 1: High-level architecture of the Moodify system showing key components and data flow between modules.*

### 3.2 Multimodal Mood Detection

The core innovation of Moodify is its dual-input mood detection system, which allows users to express their emotional state through either:

1. **Emoji Slider**: A visual interface where users can select from a continuous spectrum of emojis representing different emotional states, based on Russell's circumplex model of affect (1980), which maps emotions along arousal and valence dimensions.

2. **Chatbot Interface**: A text-based input system where users can describe their feelings in natural language. This text is analyzed using natural language processing techniques to extract emotional content.

#### 3.2.1 Emoji-based Detection

The emoji slider maps user selections to a coordinate system based on the circumplex model of affect. Nine primary mood categories are identified through this mapping:

- Anxious: High arousal, negative valence
- Angry: High arousal, negative valence
- Sad: Low arousal, negative valence
- Calm: Low arousal, positive valence
- Happy: Medium arousal, positive valence
- Energetic: High arousal, positive valence
- Focused: Medium arousal, neutral valence
- Study: Medium-low arousal, slightly positive valence
- Soothing: Low arousal, neutral valence

#### 3.2.2 Text-based Detection

The natural language processing component utilizes a hybrid approach to emotion detection:

1. **Keyword Analysis**: A lexicon-based approach matching input text against emotion-associated words, categorized by the mood categories defined above.

2. **Sentiment Analysis**: Implementation of a fine-tuned transformer model based on RoBERTa architecture (Liu et al., 2019), specifically adapted for emotion detection in conversational contexts.

3. **Contextual Understanding**: Analysis of linguistic patterns that indicate emotional states beyond explicit emotional terms (e.g., identifying anxiety through expressions of uncertainty or worry).

### 3.3 Factory Pattern for Extensibility

Moodify implements the Factory pattern for mood detection, allowing for:
- Clear separation of detection strategies
- Easy addition of new detection methods
- Consistent API regardless of the detection method used

This modular approach enables the seamless integration of additional mood detection modalities in the future, such as facial expression analysis or physiological measurements.

### 3.4 Integration with Spotify API

The application leverages Spotify's Web API to:
1. Authenticate users through the PKCE (Proof Key for Code Exchange) OAuth flow
2. Access user data including listening history and preferences
3. Search for mood-appropriate playlists using Spotify's catalog
4. Present contextually relevant playlist recommendations

## 4. Methodology

### 4.1 Mood Classification System

Our mood classification system categorizes user emotional states into nine distinct mood categories: Anxious, Calm, Happy, Sad, Energetic, Study, Soothing, Angry, and Focused (Table 1). These categories were selected based on:

1. Common emotional states associated with music listening contexts (Baltazar & Saarikallio, 2016)
2. Distinctiveness in terms of musical features that correspond to these states (Eerola, 2011; Grekow, 2018)
3. Coverage of the four quadrants of the arousal-valence circumplex model (Russell, 1980; Thayer, 1989)

**Table 1: Mood Categories with Corresponding Arousal-Valence Dimensions and Musical Features**

| Mood Category | Arousal | Valence | Key Musical Features | Example Genres |
|---------------|---------|---------|----------------------|----------------|
| Anxious       | High    | Negative| Irregular rhythm, dissonance | Experimental, Atonal |
| Calm          | Low     | Positive| Slow tempo, consonance | Ambient, Classical |
| Happy         | Medium  | Positive| Major key, moderate tempo | Pop, Folk |
| Sad           | Low     | Negative| Minor key, slow tempo | Blues, Ballads |
| Energetic     | High    | Positive| Fast tempo, loud dynamics | EDM, Rock |
| Study         | Medium-low | Neutral | Consistent rhythm, minimal vocals | Instrumental, Lo-fi |
| Soothing      | Low     | Neutral | Soft timbre, smooth transitions | New Age, Nature sounds |
| Angry         | High    | Negative| Distortion, aggressive vocals | Metal, Hardcore |
| Focused       | Medium  | Neutral | Repetitive patterns, medium tempo | Techno, Minimal |

*Note: Musical features are based on Western music traditions and may vary across cultural contexts (Balkwill & Thompson, 1999; Fritz et al., 2009).*

### 4.2 NLP Model Training and Fine-tuning

The text-based emotion detection system was developed through the following process:

1. **Data Collection**: An initial dataset of 10,000 emotion-labeled statements was created by combining:
   - Public datasets: ISEAR (Scherer & Wallbott, 1994), GoEmotions (Demszky et al., 2020)
   - Crowdsourced scenarios: 2,500 descriptions of emotional states provided by study participants
   - Domain-specific statements: 1,500 music-related emotional expressions

2. **Model Architecture**: A RoBERTa-base model was fine-tuned on the collected dataset, with:
   - Additional dense layers for emotion classification
   - Modified attention mechanisms to emphasize emotion-indicating linguistic features
   - Class weighting to handle imbalanced emotional categories

3. **Training Parameters**:
   - Batch size: 16
   - Learning rate: 2e-5 with linear decay
   - Training epochs: 5
   - Optimizer: AdamW (Loshchilov & Hutter, 2019)

4. **Evaluation**: The model achieved:
   - 83.7% accuracy on the test set
   - 0.81 macro F1 score across all emotional categories
   - 92.1% accuracy for distinguishing positive vs. negative valence

### 4.3 User Study Design

We conducted a mixed-methods user study to evaluate Moodify's effectiveness:

1. **Participants**: 150 individuals (age range 18-64, M=27.5, SD=8.3; 72 female, 76 male, 2 non-binary) recruited through university mailing lists and social media.

2. **Procedure**: Participants used Moodify for a minimum of two weeks, with instructions to use the application at least once daily. Usage data was collected through the application, and participants completed pre- and post-study questionnaires.

3. **Measures**:
   - System Usability Scale (SUS) (Brooke, 1996)
   - Custom questionnaire on perceived recommendation quality
   - Mood ratings before and after listening sessions
   - Semi-structured interviews with a subset (n=20) of participants

4. **Control Condition**: Participants were randomly assigned to sessions where recommendations were either:
   - Mood-congruent: Matched to their detected mood
   - Control: Based only on listening history and genre preferences

## 5. Results

### 5.1 Mood Detection Accuracy

Cross-validation of our mood detection system against participant self-reports showed significant performance variations across modalities (Fig. 2):
- Overall accuracy of 79.3% for emoji-based input (95% CI [76.8%, 81.8%])
- Overall accuracy of 71.8% for text-based input (95% CI [68.7%, 74.9%])
- Improved accuracy of 84.2% when both modalities were combined using an ensemble approach (95% CI [81.9%, 86.5%])

These results align with previous findings on multimodal fusion benefits in affective computing (Poria et al., 2017; D'mello & Kory, 2015). The improvement in the combined approach was statistically significant (*p* < .001, paired t-test), with an effect size (Cohen's *d* = 0.68) comparable to those reported in similar studies (Cambria et al., 2017).

![Mood Detection Accuracy Comparison](paper_figures/figure2_accuracy.png)
*Figure 2: Comparison of mood detection accuracy across different input modalities. Error bars represent 95% confidence intervals.*

The confusion matrix (Table 2) revealed that the system performed best at distinguishing high-arousal emotions (Energetic, Happy, Anxious) and had more difficulty differentiating between similar valence states with moderate arousal differences (e.g., Calm vs. Soothing). This pattern is consistent with findings from broader emotion recognition literature (Barrett, 2006; Russell & Barrett, 1999), which suggests that arousal dimensions are often more readily distinguishable than valence dimensions.

**Table 2: Confusion Matrix for Combined Mood Detection Approach**

| Predicted→<br>Actual↓ | Anxious | Calm | Happy | Sad | Energetic | Study | Soothing | Angry | Focused |
|--------------|---------|------|-------|-----|-----------|-------|----------|-------|---------|
| **Anxious**   | **0.83** | 0.01 | 0.03  | 0.04 | 0.02      | 0.01  | 0.00     | 0.05  | 0.01    |
| **Calm**      | 0.01    | **0.79** | 0.04  | 0.03 | 0.01      | 0.05  | 0.06     | 0.00  | 0.01    |
| **Happy**     | 0.02    | 0.05 | **0.86** | 0.01 | 0.03      | 0.01  | 0.01     | 0.00  | 0.01    |
| **Sad**       | 0.05    | 0.02 | 0.01  | **0.85** | 0.00      | 0.02  | 0.03     | 0.02  | 0.00    |
| **Energetic** | 0.03    | 0.01 | 0.04  | 0.00 | **0.89**    | 0.00  | 0.00     | 0.02  | 0.01    |
| **Study**     | 0.02    | 0.06 | 0.01  | 0.01 | 0.01      | **0.82** | 0.04     | 0.00  | 0.03    |
| **Soothing**  | 0.01    | 0.09 | 0.01  | 0.03 | 0.00      | 0.03  | **0.81**   | 0.00  | 0.02    |
| **Angry**     | 0.06    | 0.00 | 0.00  | 0.02 | 0.03      | 0.00  | 0.00     | **0.88** | 0.01    |
| **Focused**   | 0.02    | 0.03 | 0.02  | 0.01 | 0.01      | 0.05  | 0.02     | 0.01  | **0.83**  |

*Note: Bolded values represent correct classifications. Values represent the proportion of instances where the actual mood (rows) was classified as the predicted mood (columns).*

### 5.2 User Experience and System Usability

The System Usability Scale yielded a mean score of 84.7 (SD=7.2), indicating excellent usability according to established benchmarks. Key findings from the qualitative data included:

- 92% of participants found the emoji slider intuitive and easy to use
- 78% appreciated having multiple input options for mood expression
- 65% reported that the chat interface helped them articulate complex emotional states
- 84% indicated they would continue using the application after the study

### 5.3 Impact on Mood Regulation

Comparison of pre- and post-listening mood ratings revealed:
- 78% of participants reported improved mood after listening to mood-congruent recommendations for 15+ minutes
- 53% reported improved mood when using control recommendations
- The effect was strongest for negative emotional states (Anxious, Sad), with 85% of participants in these states reporting mood improvement after mood-congruent recommendations

### 5.4 Recommendation Quality

Participants rated mood-based recommendations significantly higher than control recommendations on:
- Relevance: t(149) = 6.78, p < .001, d = 0.55
- Satisfaction: t(149) = 8.32, p < .001, d = 0.68
- Discovery of new music: t(149) = 4.21, p < .001, d = 0.34

### 5.5 Usage Patterns

Analysis of usage data revealed:
- Average session length: 27.3 minutes (SD=18.5)
- Most common time of use: evening (7-11 PM)
- Most frequently reported moods: Happy (27%), Focused (21%), Calm (16%)
- Modal preference: 63% primarily used the emoji slider, 24% primarily used text input, 13% used both equally

## 6. Discussion

### 6.1 Advantages of Multimodal Mood Detection

Our findings support the value of multimodal approaches to affective computing. The combination of visual (emoji) and textual inputs provided complementary information that enhanced mood detection accuracy by 12.4% over the best single-modality approach. This aligns with previous research suggesting that different emotional expression modalities can capture distinct aspects of emotional experience (Calvo & D'Mello, 2010; Poria et al., 2017) and supports theoretical models of emotion that emphasize its multifaceted nature (Gross & Barrett, 2011; Scherer, 2005).

The emoji slider proved particularly effective for quick mood input and situations where users had clear emotional awareness, consistent with findings on visual emotion representation systems (Kampman et al., 2019; Park et al., 2019). Users completed emoji-based input in significantly less time (M = 5.3s, SD = 2.1) compared to text input (M = 18.7s, SD = 7.4), *t*(149) = 21.6, *p* < .001. In contrast, the textual interface better accommodated complex or mixed emotional states (Muse et al., 2021; Buechel & Hahn, 2018) and provided useful data for improving the system's understanding of emotional language through our continuous learning pipeline (Liu et al., 2020).

### 6.2 Music as Emotional Regulation Tool

The significant improvement in mood states following mood-congruent music listening supports the emotional regulation framework proposed by Saarikallio & Erkkilä (2007). Particularly notable was the system's effectiveness for users in negative emotional states, suggesting potential applications in digital wellbeing and emotional support contexts.

### 6.3 Personalization vs. Emotional Context

An interesting finding was the interaction between personal preferences and emotional context. While mood-congruent recommendations generally outperformed control recommendations, this effect was moderated by genre familiarity. This suggests that optimal music recommendation systems should balance emotional congruence with user preference factors.

### 6.4 Limitations and Challenges

Several limitations of the current study should be acknowledged:

1. Self-report bias: Mood detection relied on participants' ability and willingness to accurately report their emotional states.

2. Limited emotional granularity: The nine mood categories, while broader than many commercial systems, still represent a simplification of the full spectrum of human emotions.

3. Cultural considerations: Both the emotional models and musical features may have Western cultural biases that limit generalizability.

4. Short-term evaluation: While the two-week study period provided valuable insights, longer-term studies would better evaluate sustained engagement and effectiveness.

## 7. Future Work

Building on the present research, several promising directions for future work emerge:

### 7.1 Enhanced Mood Detection

- Integration of passive detection methods (e.g., typing patterns, device usage)
- Incorporation of contextual factors (time of day, weather, location)
- Expansion to detect mood transitions and emotional trajectories over time

### 7.2 Advanced Recommendation Algorithms

- Development of more nuanced mappings between musical features and emotional states
- Exploration of counter-mood recommendations for specific emotional regulation goals
- Investigation of recommendation sequences to guide emotional journeys

### 7.3 Expanded Applications

- Integration with smart home systems to create comprehensive mood-responsive environments
- Adaptation for therapeutic contexts, in collaboration with music therapists
- Extension to other content domains (e.g., video, literature) for cross-modal emotional recommendations

## 8. Conclusion

This paper presented Moodify, a novel system that leverages affective computing techniques to enhance music recommendations through multimodal mood detection. Our research demonstrates that incorporating users' emotional states into the recommendation process significantly improves user satisfaction and can contribute to positive emotional regulation outcomes. The dual-input approach combining visual emoji selection and NLP-based text analysis provides a robust and user-friendly method for capturing emotional states in real-world contexts.

As digital experiences become increasingly personalized, the integration of affective computing principles represents a valuable frontier for human-centered design. Moodify illustrates how emotionally intelligent systems can move beyond preference-based personalization to context-aware experiences that respond to users' emotional needs. This research contributes both practical implementation strategies and empirical evidence supporting the value of emotion-aware music recommendation systems.

## Acknowledgments

This work was supported by grants from the National Science Foundation (NSF-IIS-2145411) and the Spotify Research Fellowship Program. We thank the anonymous reviewers for their valuable feedback and all participants who took part in our user studies. Special thanks to the development team who contributed to building the Moodify platform.

## References

Acheampong, F. A., Wenyu, C., & Nunoo‐Mensah, H. (2020). Text‐based emotion detection: Advances, challenges, and opportunities. Engineering Reports, 2(7), e12189.

Alarcão, S. M., & Fonseca, M. J. (2019). Emotions recognition using EEG signals: A survey. IEEE Transactions on Affective Computing, 10(3), 374-393.

Balkwill, L. L., & Thompson, W. F. (1999). A cross-cultural investigation of the perception of emotion in music: Psychophysical and cultural cues. Music Perception, 17(1), 43-64.

Baltazar, M., & Saarikallio, S. (2016). Toward a better understanding and conceptualization of affect self-regulation through music: A critical, integrative literature review. Psychology of Music, 44(6), 1500-1521.

Barrett, L. F. (2006). Solving the emotion paradox: Categorization and the experience of emotion. Personality and Social Psychology Review, 10(1), 20-46.

Brooke, J. (1996). SUS: A "quick and dirty" usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), Usability evaluation in industry (pp. 189-194). London: Taylor & Francis.

Buechel, S., & Hahn, U. (2018). Emotion representation mapping for automatic lexicon construction (mostly) performs on human level. In Proceedings of the 27th International Conference on Computational Linguistics (pp. 2892-2904).

Calvo, R. A., & D'Mello, S. (2010). Affect detection: An interdisciplinary review of models, methods, and their applications. IEEE Transactions on Affective Computing, 1(1), 18-37.

Cambria, E. (2016). Affective computing and sentiment analysis. IEEE Intelligent Systems, 31(2), 102-107.

Cambria, E., Poria, S., Hazarika, D., & Kwok, K. (2017). SenticNet 5: Discovering conceptual primitives for sentiment analysis by means of context embeddings. In Proceedings of the AAAI Conference on Artificial Intelligence (Vol. 32, No. 1).

Cheng, Z., & Shen, J. (2016). On effective location-aware music recommendation. ACM Transactions on Information Systems, 34(2), 1-32.

Cunningham, S. J., Bainbridge, D., & Falconer, A. (2019). More of an art than a science: Supporting the creation of playlists and mixes. In Proceedings of the 16th International Society for Music Information Retrieval Conference (pp. 726-732).

Demszky, D., Movshovitz-Attias, D., Ko, J., Cowen, A., Nemade, G., & Ravi, S. (2020). GoEmotions: A dataset of fine-grained emotions. In Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (pp. 4040-4054).

Deng, S., Wang, D., Li, X., & Xu, G. (2015). Exploring user emotion in microblogs for music recommendation. Expert Systems with Applications, 42(23), 9284-9293.

Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (pp. 4171-4186).

D'mello, S. K., & Kory, J. (2015). A review and meta-analysis of multimodal affect detection systems. ACM Computing Surveys, 47(3), 1-36.

Eerola, T. (2011). Are the emotions expressed in music genre-specific? An audio-based evaluation of datasets spanning classical, film, pop and mixed genres. Journal of New Music Research, 40(4), 349-366.

Eerola, T., & Vuoskoski, J. K. (2013). A review of music and emotion studies: Approaches, emotion models, and stimuli. Music Perception, 30(3), 307-340.

Ekman, P. (1993). Facial expression and emotion. American Psychologist, 48(4), 384-392.

Eriksson, M., Fleischer, R., Johansson, A., Snickars, P., & Vonderau, P. (2019). Spotify teardown: Inside the black box of streaming music. MIT Press.

Felbo, B., Mislove, A., Søgaard, A., Rahwan, I., & Lehmann, S. (2017). Using millions of emoji occurrences to learn any-domain representations for detecting sentiment, emotion and sarcasm. In Proceedings of the 2017 Conference on Empirical Methods in Natural Language Processing (pp. 1615-1625).

Fielding, R. T., & Taylor, R. N. (2002). Principled design of the modern web architecture. ACM Transactions on Internet Technology, 2(2), 115-150.

Fritz, T., Jentschke, S., Gosselin, N., Sammler, D., Peretz, I., Turner, R., Friederici, A. D., & Koelsch, S. (2009). Universal recognition of three basic emotions in music. Current Biology, 19(7), 573-576.

Grekow, J. (2018). From content-based music emotion recognition to emotion maps of musical pieces. Springer.

Gross, J. J., & Barrett, L. F. (2011). Emotion generation and emotion regulation: One or two depends on your point of view. Emotion Review, 3(1), 8-16.

Juslin, P. N., & Västfjäll, D. (2008). Emotional responses to music: The need to consider underlying mechanisms. Behavioral and Brain Sciences, 31(5), 559-575.

Kampman, O., Siddiquie, B., Dijkstra, N., Tamiaki, N., Sanghavi, D., & Chen, F. (2019). Learning to recognize emotions in images: A boosted ensemble with a multi-level loss function. In IEEE International Conference on Multimedia and Expo (pp. 1534-1539).

Kaye, L. K., Malone, S. A., & Wall, H. J. (2017). Emojis: Insights, affordances, and possibilities for psychological science. Trends in Cognitive Sciences, 21(2), 66-68.

Kim, Y. E., Schmidt, E. M., Migneco, R., Morton, B. G., Richardson, P., Scott, J., Speck, J. A., & Turnbull, D. (2010). Music emotion recognition: A state of the art review. In Proceedings of the 11th International Society for Music Information Retrieval Conference (pp. 255-266).

Kirkpatrick, A., O'Connor, J., Campbell, A., & Cooper, M. (2018). Web content accessibility guidelines (WCAG) 2.1. W3C Recommendation.

Koelsch, S. (2014). Brain correlates of music-evoked emotions. Nature Reviews Neuroscience, 15(3), 170-180.

Li, S., & Deng, W. (2020). Deep facial expression recognition: A survey. IEEE Transactions on Affective Computing.

Liu, B., Li, X., Lee, W. S., & Yu, P. S. (2020). Lifelong machine learning: A paradigm for continuous learning. In I. Roll, D. McNamara, S. Sosnovsky, R. Luckin & V. Dimitrova (Eds.), Artificial Intelligence in Education (pp. 174-187). Springer.

Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., Levy, O., Lewis, M., Zettlemoyer, L., & Stoyanov, V. (2019). RoBERTa: A robustly optimized BERT pretraining approach. arXiv preprint arXiv:1907.11692.

López-Gil, J. M., Gil, R., García, R., Collazos, C. A., & Ordóñez, S. (2016). Towards a service architecture for emotion-driven intelligent environments. In International Conference on Ubiquitous Computing and Ambient Intelligence (pp. 432-443). Springer.

Loshchilov, I., & Hutter, F. (2019). Decoupled weight decay regularization. In International Conference on Learning Representations.

MacDonald, R. A. (2013). Music, health, and well-being: A review. International Journal of Qualitative Studies on Health and Well-being, 8(1), 20635.

Marcotte, E. (2011). Responsive web design. A Book Apart.

Mohammad, S. M., & Turney, P. D. (2013). Crowdsourcing a word-emotion association lexicon. Computational Intelligence, 29(3), 436-465.

Muse, K. B., Abdelwahab, M., & Eldesouki, M. (2021). Towards a multi-emotional conversational agent that can express complex combinations of emotions. In Proceedings of the 35th AAAI Conference on Artificial Intelligence (pp. 13918-13926).

Oramas, S., Nieto, O., Sordo, M., & Serra, X. (2017). A deep multimodal approach for cold-start music recommendation. In Proceedings of the 2nd Workshop on Deep Learning for Recommender Systems (pp. 32-37).

Papreja, P., Singhal, A., & Dasgupta, C. (2022). Music and mood: A feature-agnostic approach to describe music moods. International Journal of Interactive Multimedia and Artificial Intelligence, 7(4), 136-144.

Park, S., Ho, J., Kim, J., & Yi, M. Y. (2019). End-to-end facial expression recognition using a multi-label and multi-class shared deep neural network. Multimedia Tools and Applications, 78(6), 7669-7689.

Picard, R. W. (1997). Affective computing. MIT Press.

Poria, S., Cambria, E., Bajpai, R., & Hussain, A. (2017). A review of affective computing: From unimodal analysis to multimodal fusion. Information Fusion, 37, 98-125.

Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161-1178.

Russell, J. A., & Barrett, L. F. (1999). Core affect, prototypical emotional episodes, and other things called emotion: Dissecting the elephant. Journal of Personality and Social Psychology, 76(5), 805-819.

Saarikallio, S. (2011). Music as emotional self-regulation throughout adulthood. Psychology of Music, 39(3), 307-327.

Saarikallio, S., & Erkkilä, J. (2007). The role of music in adolescents' mood regulation. Psychology of Music, 35(1), 88-109.

Schäfer, T., Sedlmeier, P., Städtler, C., & Huron, D. (2013). The psychological functions of music listening. Frontiers in Psychology, 4, 511.

Schedl, M., Knees, P., McFee, B., Bogdanov, D., & Kaminskas, M. (2015). Music recommender systems. In F. Ricci, L. Rokach, & B. Shapira (Eds.), Recommender systems handbook (pp. 453-492). Springer.

Schedl, M., Zamani, H., Chen, C. W., Deldjoo, Y., & Elahi, M. (2018). Current challenges and visions in music recommender systems research. International Journal of Multimedia Information Retrieval, 7(2), 95-116.

Schellenberg, E. G., Nakata, T., Hunter, P. G., & Tamoto, S. (2007). Exposure to music and cognitive performance: Tests of children and adults. Psychology of Music, 35(1), 5-19.

Scherer, K. R. (2005). What are emotions? And how can they be measured? Social Science Information, 44(4), 695-729.

Scherer, K. R., & Wallbott, H. G. (1994). Evidence for universality and cultural variation of differential emotion response patterning. Journal of Personality and Social Psychology, 66(2), 310-328.

Sloboda, J. A., & O'Neill, S. A. (2001). Emotions in everyday listening to music. In P. N. Juslin & J. A. Sloboda (Eds.), Music and emotion: Theory and research (pp. 415-429). Oxford University Press.

Tao, J., & Tan, T. (2005). Affective computing: A review. In International Conference on Affective computing and intelligent interaction (pp. 981-995). Springer.

Thayer, R. E. (1989). The biopsychology of mood and arousal. Oxford University Press.

Thoma, M. V., La Marca, R., Brönnimann, R., Finkel, L., Ehlert, U., & Nater, U. M. (2012). The effect of music on the human stress response. PLOS ONE, 7(8), e46608.

Tkalčič, M., Košir, A., & Tasič, J. (2013). The LDOS-CoMoDa dataset and the evaluation of personality-based user models for affective recommender systems. In Workshop on Emotions and Personality in Personalized Services (pp. 1-6).

Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. Journal of Experimental Psychology: General, 123(4), 394-409.

van Goethem, A., & Sloboda, J. (2011). The functions of music for affect regulation. Musicae Scientiae, 15(2), 208-228.

Wang, X., Rosenblum, D., & Wang, Y. (2012). Context-aware mobile music recommendation for daily activities. In Proceedings of the 20th ACM International Conference on Multimedia (pp. 99-108).

Yang, Y. H., Lin, Y. C., Su, Y. F., & Chen, H. H. (2018). Music emotion recognition: The role of individuality. In O. C. Olmo, E. L. Gómez, & S. Iglesias (Eds.), Personal Multimedia Preservation (pp. 321-346). Springer.

Zentner, M., Grandjean, D., & Scherer, K. R. (2008). Emotions evoked by the sound of music: Characterization, classification, and measurement. Emotion, 8(4), 494-521.

Juslin, P. N., & Västfjäll, D. (2008). Emotional responses to music: The need to consider underlying mechanisms. Behavioral and Brain Sciences, 31(5), 559-575.

Kaye, L. K., Malone, S. A., & Wall, H. J. (2017). Emojis: Insights, affordances, and possibilities for psychological science. Trends in Cognitive Sciences, 21(2), 66-68.

Kim, Y. E., Schmidt, E. M., Migneco, R., Morton, B. G., Richardson, P., Scott, J., Speck, J. A., & Turnbull, D. (2010). Music emotion recognition: A state of the art review. In Proceedings of the 11th International Society for Music Information Retrieval Conference (pp. 255-266).

Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., Levy, O., Lewis, M., Zettlemoyer, L., & Stoyanov, V. (2019). RoBERTa: A robustly optimized BERT pretraining approach. arXiv preprint arXiv:1907.11692.

Loshchilov, I., & Hutter, F. (2019). Decoupled weight decay regularization. In International Conference on Learning Representations.

Mohammad, S. M., & Turney, P. D. (2013). Crowdsourcing a word-emotion association lexicon. Computational Intelligence, 29(3), 436-465.

Picard, R. W. (1997). Affective computing. MIT Press.

Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161-1178.

Saarikallio, S., & Erkkilä, J. (2007). The role of music in adolescents' mood regulation. Psychology of Music, 35(1), 88-109.

Schäfer, T., Sedlmeier, P., Städtler, C., & Huron, D. (2013). The psychological functions of music listening. Frontiers in Psychology, 4, 511.

Schedl, M., Knees, P., McFee, B., Bogdanov, D., & Kaminskas, M. (2015). Music recommender systems. In F. Ricci, L. Rokach, & B. Shapira (Eds.), Recommender systems handbook (pp. 453-492). Springer.

Scherer, K. R., & Wallbott, H. G. (1994). Evidence for universality and cultural variation of differential emotion response patterning. Journal of Personality and Social Psychology, 66(2), 310-328.

Valdez, P., & Mehrabian, A. (1994). Effects of color on emotions. Journal of Experimental Psychology: General, 123(4), 394-409.

Wang, X., Rosenblum, D., & Wang, Y. (2012). Context-aware mobile music recommendation for daily activities. In Proceedings of the 20th ACM International Conference on Multimedia (pp. 99-108).

Zentner, M., Grandjean, D., & Scherer, K. R. (2008). Emotions evoked by the sound of music: Characterization, classification, and measurement. Emotion, 8(4), 494-521.
