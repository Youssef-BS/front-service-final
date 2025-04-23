import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ChambreService } from '../../core/services/chambre.service';
import { BlocService } from '../../core/services/bloc.service';
import { UniversiteService } from '../../core/services/universite.service';
import { FoyerService } from '../../core/services/foyer.service';
import { ReservationService } from '../../core/services/reservation.service';
import { LineBreakPipe } from './line-break.pipe';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string; // For bot emotions: happy, thinking, curious, etc.
}

interface ChatState {
  messages: Message[];
  userInput: string;
  isOpen: boolean;
  isLoading: boolean;
  botName: string;
  botMood: string;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LineBreakPipe],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  // Chat state
  state: ChatState = {
    messages: [],
    userInput: '',
    isOpen: false,
    isLoading: false,
    botName: 'Campy', // Friendly name for the bot
    botMood: 'happy'  // Initial mood
  };

  // Friendly greetings
  private welcomeMessages = [
    "Salut ! Je suis Campy, ton ami virtuel pour t'aider à trouver le logement parfait ! 😊 Dis-moi comment je peux t'aider aujourd'hui ?",
    "Coucou ! Moi c'est Campy, ton assistant personnel pour la réservation de logements universitaires. Comment vas-tu aujourd'hui ?",
    "Hello ! 👋 Je suis Campy, ton copain virtuel toujours prêt à t'aider avec tes questions sur les foyers universitaires. Que puis-je faire pour toi ?",
    "Bonjour ! Super content de te parler aujourd'hui ! Je suis Campy, ton assistant pour tout ce qui concerne les foyers. Comment puis-je égayer ta journée ?",
    "Hey ! C'est Campy ! 🏠 Je suis là pour te guider dans ta recherche de logement. Dis-moi ce qui t'amène !"
  ];

  // Fun facts about student housing to share occasionally
  private funFacts = [
    "Le savais-tu ? Les résidences universitaires modernes proposent souvent des espaces communs comme des salles de sport et des espaces de coworking !",
    "Astuce : Réserver ton logement tôt peut augmenter tes chances d'obtenir ta chambre préférée !",
    "Info sympa : La vie en résidence universitaire est une excellente façon de se faire des amis du monde entier !",
    "Le savais-tu ? Certaines résidences proposent des activités sociales régulières pour les étudiants !",
    "Conseil d'ami : N'oublie pas de vérifier si ton foyer préféré offre une connexion Wi-Fi gratuite !"
  ];

  // Store API data
  chambres: any[] = [];
  blocs: any[] = [];
  foyers: any[] = [];
  universites: any[] = [];
  reservations: any[] = [];
  
  // Gemini API key
  private readonly GEMINI_API_KEY = 'AIzaSyA8n1LE4N0N8PtoKzITZP1nS4nhD6D0tG4';
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(
    private http: HttpClient,
    private chambreService: ChambreService,
    private blocService: BlocService,
    private universiteService: UniversiteService,
    private foyerService: FoyerService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // Load initial chat history from localStorage if available
    this.loadChatHistory();
    
    // Load data from services
    this.loadAllData();
    
    // Add welcome message if there's no history
    if (this.state.messages.length === 0) {
      this.addRandomWelcomeMessage();
    }
  }

  toggleChat(): void {
    this.state.isOpen = !this.state.isOpen;
    
    // If opening the chat and it's empty, add welcome message
    if (this.state.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
      
      // If returning after a while, say hello again
      const lastMessage = this.state.messages[this.state.messages.length - 1];
      const now = new Date();
      
      // If last message was more than 30 minutes ago and from the bot, add a returning greeting
      if (lastMessage && !lastMessage.isUser && 
          (now.getTime() - lastMessage.timestamp.getTime() > 30 * 60 * 1000)) {
        this.addBotMessage("Te revoilà ! 😊 J'espère que tu passes une bonne journée. Je peux t'aider avec quelque chose ?", "happy");
      }
    }
  }

  sendMessage(): void {
    if (!this.state.userInput.trim()) return;
    
    // Add user message
    this.addUserMessage(this.state.userInput);
    const userQuery = this.state.userInput;
    this.state.userInput = '';
    
    // Set loading state
    this.state.isLoading = true;
    
    // If it's a simple greeting, respond immediately without API call
    if (this.isSimpleGreeting(userQuery)) {
      this.handleSimpleGreeting(userQuery);
      return;
    }
    
    // Check for quick questions that don't need the API
    if (this.isQuickQuestion(userQuery)) {
      this.handleQuickQuestion(userQuery);
      return;
    }
    
    // Process the user message and generate a response
    this.generateBotResponse(userQuery);
  }

  isSimpleGreeting(text: string): boolean {
    const greetings = ['bonjour', 'salut', 'hello', 'coucou', 'hey', 'hi', 'yo', 'bonsoir'];
    const lowerText = text.toLowerCase();
    return greetings.some(greeting => lowerText.includes(greeting)) && text.length < 20;
  }

  handleSimpleGreeting(text: string): void {
    const responses = [
      "Salut ! Comment je peux t'aider aujourd'hui ? 😊",
      "Hello ! Ravi de te parler ! Que puis-je faire pour toi ?",
      "Coucou ! C'est toujours un plaisir de discuter avec toi ! Qu'est-ce qui t'amène ?",
      "Hey ! Comment se passe ta journée ? Je suis là pour t'aider !",
      "Bonjour ! Super de te voir ! En quoi puis-je t'être utile aujourd'hui ?"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    this.addBotMessage(randomResponse, "happy");
    this.state.isLoading = false;
  }

  isQuickQuestion(text: string): boolean {
    const lowerText = text.toLowerCase();
    return lowerText.includes('comment vas-tu') || 
           lowerText.includes('ça va') || 
           lowerText.includes('qui es-tu') || 
           lowerText.includes('ton nom') ||
           lowerText.includes('merci');
  }

  handleQuickQuestion(text: string): void {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('comment vas-tu') || lowerText.includes('ça va')) {
      const responses = [
        "Je vais super bien, merci de demander ! 😊 Et toi ?",
        "Toujours au top quand je peux aider ! Comment vas-tu ?",
        "En pleine forme ! Prêt à t'aider avec tout ce dont tu as besoin !",
        "Je me sens génial aujourd'hui ! Merci de t'en soucier !"
      ];
      this.addBotMessage(responses[Math.floor(Math.random() * responses.length)], "happy");
    } 
    else if (lowerText.includes('qui es-tu') || lowerText.includes('ton nom')) {
      this.addBotMessage(`Je m'appelle ${this.state.botName}, ton ami virtuel pour t'aider avec tout ce qui concerne les foyers universitaires ! Je suis là pour répondre à tes questions, te guider dans les réservations et même te donner quelques conseils sympas ! 🏠 Que puis-je faire pour toi aujourd'hui ?`, "curious");
    }
    else if (lowerText.includes('merci')) {
      const responses = [
        "Avec plaisir ! N'hésite pas si tu as d'autres questions ! 😊",
        "Pas de problème ! Je suis toujours content d'aider !",
        "C'est un plaisir de t'aider ! Y a-t-il autre chose que je puisse faire pour toi ?",
        "De rien ! C'est pour ça que je suis là ! 👍"
      ];
      this.addBotMessage(responses[Math.floor(Math.random() * responses.length)], "happy");
    }
    
    this.state.isLoading = false;
  }

  addRandomWelcomeMessage(): void {
    const randomIndex = Math.floor(Math.random() * this.welcomeMessages.length);
    this.addBotMessage(this.welcomeMessages[randomIndex], "happy");
  }

  addUserMessage(text: string): void {
    this.state.messages.push({
      text,
      isUser: true,
      timestamp: new Date()
    });
    this.saveChatHistory();
    setTimeout(() => this.scrollToBottom(), 100);
  }

  addBotMessage(text: string, emotion: string = 'neutral'): void {
    this.state.messages.push({
      text,
      isUser: false,
      timestamp: new Date(),
      emotion
    });
    this.saveChatHistory();
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  saveChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify(this.state.messages));
  }

  loadChatHistory(): void {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        this.state.messages = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Reset if there's an error
        this.state.messages = [];
      }
    }
  }

  clearChat(): void {
    this.state.messages = [];
    localStorage.removeItem('chatHistory');
    this.addRandomWelcomeMessage();
  }

  loadAllData(): void {
    this.chambreService.getAllChambres().subscribe({
      next: (data) => {
        this.chambres = data;
      },
      error: (error) => {
        console.error('Error fetching chambres:', error);
      }
    });
    
    this.blocService.getAllBlocs().subscribe({
      next: (data) => {
        this.blocs = data;
      },
      error: (error) => {
        console.error('Error fetching blocs:', error);
      }
    });
    
    this.universiteService.getAll().subscribe({
      next: (data) => {
        this.universites = data;
      },
      error: (error) => {
        console.error('Error fetching universites:', error);
      }
    });
    
    this.foyerService.getFoyers().subscribe({
      next: (data) => {
        this.foyers = data;
      },
      error: (error) => {
        console.error('Error fetching foyers:', error);
      }
    });
    
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (error) => {
        console.error('Error fetching reservations:', error);
      }
    });
  }

  async generateBotResponse(userQuery: string): Promise<void> {
    try {
      // Create context for the AI with available data
      const context = this.preparePromptContext();
      
      // Prepare the prompt with user query and context
      const prompt = `
        ${context}
        
        Utilisateur: ${userQuery}
        
        Réponds de manière amicale, personnelle et concise comme si tu étais un assistant sympathique d'une résidence universitaire. Sois serviable tout en gardant un ton décontracté.
      `;
      
      // Call Gemini API
      let response = await this.callGeminiApi(prompt);
      
      // Determine if we should add a fun fact (randomly)
      const shouldAddFunFact = Math.random() < 0.15; // 15% chance
      
      // Add the enhanced response with potential fun fact
      this.addEnhancedResponse(response, shouldAddFunFact);
      
    } catch (error) {
      console.error('Error generating response:', error);
      this.addBotMessage("Désolé, j'ai rencontré un problème technique. Peux-tu réessayer ta question ?", "confused");
    } finally {
      this.state.isLoading = false;
    }
  }

  addEnhancedResponse(response: string, addFunFact: boolean = false): void {
    // Make the response more friendly and personable
    let enhancedResponse = this.makeFriendlier(response);
    
    // Add a fun fact occasionally if flag is true
    if (addFunFact) {
      const randomFact = this.funFacts[Math.floor(Math.random() * this.funFacts.length)];
      enhancedResponse += `\n\n${randomFact}`;
    }
    
    // Determine emotion based on content
    let emotion = 'neutral';
    if (enhancedResponse.includes('désolé') || 
        enhancedResponse.includes('malheureusement') || 
        enhancedResponse.includes('problème')) {
      emotion = 'sad';
    } else if (enhancedResponse.includes('super') || 
               enhancedResponse.includes('excellent') || 
               enhancedResponse.includes('parfait') ||
               enhancedResponse.includes('😊')) {
      emotion = 'happy';
    } else if (enhancedResponse.includes('pense') || 
               enhancedResponse.includes('peut-être') ||
               enhancedResponse.includes('suggestion')) {
      emotion = 'thinking';
    } else if (enhancedResponse.includes('intéressant') ||
               enhancedResponse.includes('savais-tu') ||
               enhancedResponse.includes('découvrir')) {
      emotion = 'curious';
    } else if (enhancedResponse.includes('pas sûr') || 
               enhancedResponse.includes('confusion') ||
               enhancedResponse.includes('compliqué')) {
      emotion = 'confused';
    }
    
    // Add the response with appropriate emotion
    this.addBotMessage(enhancedResponse, emotion);
    
    // Conditionally add follow-up data references if available
    this.enhanceResponseWithData(response, emotion);
  }

  makeFriendlier(text: string): string {
    // Remove AI-like phrases
    let friendlyText = text
      .replace(/En tant qu'assistant AI|En tant qu'IA|En tant que modèle de langage|Je suis une IA/gi, 'En tant que')
      .replace(/Je n'ai pas accès à|Je n'ai pas la capacité de|je ne peux pas accéder à/gi, "Je n'ai pas")
      .replace(/Je ne peux pas fournir des informations en temps réel/gi, "Je n'ai pas les dernières informations");
    
    // Add emoji based on content
    if (friendlyText.toLowerCase().includes('bonjour') || 
        friendlyText.toLowerCase().includes('salut') || 
        friendlyText.toLowerCase().includes('hello')) {
      friendlyText = friendlyText.replace(/\b(bonjour|salut|hello)\b/i, '$1 👋');
    }
    
    if (friendlyText.toLowerCase().includes('merci')) {
      friendlyText = friendlyText.replace(/\bmerci\b/i, 'merci 😊');
    }
    
    if (friendlyText.toLowerCase().includes('logement') || 
        friendlyText.toLowerCase().includes('foyer') || 
        friendlyText.toLowerCase().includes('chambre') ||
        friendlyText.toLowerCase().includes('résidence')) {
      // Add home emoji if not already present
      if (!friendlyText.includes('🏠')) {
        friendlyText = friendlyText.replace(/\b(logement|foyer|chambre|résidence)\b/i, '🏠 $1');
      }
    }
    
    // Convert formal sentences to more casual
    friendlyText = friendlyText
      .replace(/Il est recommandé de/gi, "Je te recommande de")
      .replace(/Il serait préférable de/gi, "Il vaudrait mieux")
      .replace(/Veuillez/gi, "Peux-tu")
      .replace(/Il est possible de/gi, "Tu peux");
    
    // Add casual language markers
    if (Math.random() < 0.3) { // 30% chance
      const casualMarkers = [
        "Hé ! ",
        "Génial ! ",
        "Super ! ",
        "Cool ! ",
        "Parfait ! "
      ];
      
      // Only add if the message is positive
      if (!friendlyText.includes('désolé') && 
          !friendlyText.includes('malheureusement') && 
          !friendlyText.includes('problème')) {
        friendlyText = casualMarkers[Math.floor(Math.random() * casualMarkers.length)] + friendlyText;
      }
    }
    
    return friendlyText;
  }

  preparePromptContext(): string {
    // Prepare a summary of available data for context
    return `
      Tu es Campy, un chatbot amical qui aide les étudiants à trouver des logements universitaires.
      
      Voici les données disponibles sur la plateforme de réservation de logements universitaires:
      
      ${this.formatDataForPrompt()}
      
      Quand tu ne connais pas une réponse, dis-le simplement sans inventer d'informations. 
      Utilise les émojis et un langage familier pour communiquer avec les étudiants.
      Garde tes réponses concises et utiles.
    `;
  }

  formatDataForPrompt(): string {
    // Create summaries of each data type without overwhelming the context
    const chambresSummary = this.chambres.length > 0 
      ? `${this.chambres.length} chambres disponibles` 
      : "Pas de données de chambres disponibles";
    
    const blocsSummary = this.blocs.length > 0 
      ? `${this.blocs.length} blocs d'hébergement` 
      : "Pas de données de blocs disponibles";
    
    const universitesSummary = this.universites.length > 0 
      ? `${this.universites.length} universités: ${this.universites.map(u => u.nomUniversite).join(', ')}` 
      : "Pas de données d'universités disponibles";
    
    const foyersSummary = this.foyers.length > 0 
      ? `${this.foyers.length} foyers disponibles` 
      : "Pas de données de foyers disponibles";
    
    const reservationsSummary = this.reservations.length > 0 
      ? `${this.reservations.length} réservations dans le système` 
      : "Pas de données de réservations disponibles";
    
    return `
      - ${chambresSummary}
      - ${blocsSummary}
      - ${universitesSummary}
      - ${foyersSummary}
      - ${reservationsSummary}
    `;
  }

  async callGeminiApi(prompt: string): Promise<string> {
    try {
      const url = `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
      
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      
      const response = await this.http.post(url, requestBody, { headers }).toPromise();
      
      // Extract and return the generated text
      if (response && (response as any).candidates && (response as any).candidates.length > 0) {
        const generatedText = (response as any).candidates[0].content.parts[0].text;
        return generatedText;
      } else {
        throw new Error('No response from Gemini API');
      }
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  enhanceResponseWithData(response: string, emotion: string = 'neutral'): void {
    // Note: This is a placeholder for adding more sophisticated data-based enhancements
    // For now, we're just using the basic response
  }

  // Save chat history before the user leaves the page
  @HostListener('window:beforeunload')
  saveBeforeUnload(): void {
    this.saveChatHistory();
  }
} 