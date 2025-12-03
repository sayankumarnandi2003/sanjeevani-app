import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Activity,
  MessageSquare,
  ShoppingCart,
  Bell,
  AlertTriangle,
  MapPin,
  Send,
  Plus,
  Trash2,
  Phone,
  Pill,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findLocalAnswer } from './healthData';

// API Key from Environment Variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Mock Data & Helpers ---

const MOCK_MEDICINES = [
  { id: 1, name: "Paracetamol 650mg", price: 30, category: "Fever", image: "hhttps://www.stelonbiotech.com/wp-content/uploads/2022/04/PYREMUST-650-TAB.jpg" },
  { id: 2, name: "Cetirizine 10mg", price: 25, category: "Allergy", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Cetirizine" },
  { id: 3, name: "Vitamin C Supplements", price: 150, category: "Immunity", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Vitamin+C" },
  { id: 4, name: "Amoxicillin 500mg", price: 85, category: "Antibiotic", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Amoxicillin" },
  { id: 5, name: "Diabetes Care Kit", price: 450, category: "Diabetes", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Diabetes+Kit" },
  { id: 6, name: "Digital Thermometer", price: 250, category: "Device", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Thermometer" },
  { id: 7, name: "Cough Syrup", price: 120, category: "Cold/Flu", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Cough+Syrup" },
  { id: 8, name: "Pain Relief Gel", price: 95, category: "Pain", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Pain+Relief" },
  { id: 9, name: "N95 Masks (Pack of 5)", price: 200, category: "Safety", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=N95+Masks" },
  { id: 10, name: "Hand Sanitizer 500ml", price: 150, category: "Safety", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Sanitizer" },
];

// --- Components ---

// 1. Navigation Sidebar (Mobile/Desktop)
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, profiles, currentProfileId, setCurrentProfileId, onAddProfile, onUpdateProfile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];

  const menuItems = [
    { id: 'dashboard', label: 'Health Dashboard', icon: Activity },
    { id: 'chat', label: 'AI Health Bot', icon: MessageSquare },
    { id: 'sos', label: 'Emergency SOS', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'order', label: 'Order Medicines', icon: ShoppingCart },
    { id: 'reminders', label: 'Pill Reminders', icon: Bell },
  ];

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setIsEditing(false);
  };

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      onAddProfile(newProfileName);
      setNewProfileName("");
      setIsEditing(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-64 flex flex-col`}>
      <div className="p-6 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-green-600 fill-current" />
          <h1 className="text-xl font-bold text-gray-800">Sanjeevani<span className="text-green-600">Bharat</span></h1>
        </div>
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden">
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
              ? 'bg-green-50 text-green-700 font-semibold'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <item.icon className={`h-5 w-5 ${item.color || ''}`} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="relative border-t bg-gray-50">
        {showProfileMenu && (
          <div className="absolute bottom-full left-0 w-full bg-white border-t border-r border-l rounded-t-xl shadow-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-700">Select Profile</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => {
                    setCurrentProfileId(profile.id);
                    setShowProfileMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg ${currentProfileId === profile.id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
                >
                  <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-xs font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm truncate">{profile.name}</span>
                  {currentProfileId === profile.id && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
                </button>
              ))}
            </div>

            {isEditing ? (
              <div className="mt-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full p-2 border rounded-lg text-sm mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleAddProfile} className="flex-1 bg-green-600 text-white py-1 rounded text-sm">Save</button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-green-500 hover:text-green-600"
              >
                <Plus className="h-4 w-4" /> Add New Profile
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleProfileClick}
          className="w-full p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
        >
          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
            {currentProfile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentProfile.name}</p>
            <p className="text-xs text-gray-500 truncate">ID: {currentProfile.id}</p>
          </div>
          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </div>
  );
};

// 2. Chatbot Component with Gemini API
const Chatbot = ({ apiKey, setApiKey, isHardcoded }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am Sanjeevani AI. How can I assist with your health today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (!apiKey) {
        // Fallback for no API key
        const localAnswer = findLocalAnswer(input);
        if (localAnswer) {
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: localAnswer, sender: 'bot' }]);
            setIsLoading(false);
          }, 500); // Simulate delay
          return;
        }
        throw new Error("API Key is missing and I couldn't find a local answer.");
      }

      console.log("Using API Key:", apiKey.substring(0, 10) + "...");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are Sanjeevani AI, a helpful and empathetic health assistant for Indian users. 
      Answer the following health-related question concisely and safely. 
      If it's a serious medical emergency, advise them to use the SOS button or see a doctor.
      User: ${input}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { id: Date.now() + 1, text: text, sender: 'bot' }]);
    } catch (error) {
      console.error("Gemini API Error:", error);

      // Fallback on API error
      const localAnswer = findLocalAnswer(input);
      if (localAnswer) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: localAnswer, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "I'm having trouble connecting to the internet, and I couldn't find an answer in my offline database. Please consult a doctor for accurate advice.",
          sender: 'bot',
          isError: true
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="bg-green-100 p-4 rounded-full">
          <MessageSquare className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Setup AI Chatbot</h2>
        <p className="text-gray-600 max-w-md">
          To use the AI capabilities, please enter your Google Gemini API Key.
          Your key is stored locally in your browser.
        </p>
        <div className="w-full max-w-md space-y-4">
          <input
            type="password"
            placeholder="Enter Gemini API Key"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Get one here</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="bg-green-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="font-semibold">AI Health Assistant</h2>
        </div>
        {!isHardcoded && (
          <button onClick={() => setApiKey("")} className="text-xs bg-green-700 px-2 py-1 rounded hover:bg-green-800">
            Change Key
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
              ? 'bg-green-600 text-white rounded-br-none'
              : msg.isError
                ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-none'
                : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border p-3 rounded-2xl rounded-bl-none shadow-sm text-gray-500 text-sm flex gap-2 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your symptoms or question..."
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// 3. SOS Component
const SOS = () => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  const handleSOS = () => {
    setStatus("Locating...");
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setStatus("Error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setStatus("Location Found");

        const message = `SOS! I need medical help. My location: https://maps.google.com/?q=${latitude},${longitude}`;

        if (navigator.share) {
          navigator.share({
            title: 'Emergency SOS',
            text: message,
            url: `https://maps.google.com/?q=${latitude},${longitude}`
          }).catch(console.error);
        } else {
          window.location.href = `sms:108?body=${encodeURIComponent(message)}`;
        }
      },
      (err) => {
        setError("Unable to retrieve location. Please enable GPS.");
        setStatus("Error");
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Emergency SOS</h2>
        <p className="text-gray-500">Pressing this will share your live location with emergency contacts.</p>
      </div>

      <button
        onClick={handleSOS}
        className="relative group animate-pulse hover:animate-none"
      >
        <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative h-48 w-48 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-red-200 group-hover:scale-105 transition-transform cursor-pointer">
          <div className="text-center text-white">
            <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
            <span className="text-2xl font-bold tracking-widest">HELP</span>
          </div>
        </div>
      </button>

      {status === "Locating..." && <p className="text-blue-600 font-medium animate-pulse">Acquiring satellite lock...</p>}

      {location && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <p className="text-green-800 font-semibold flex items-center gap-2 justify-center">
            <MapPin className="h-4 w-4" /> Location Acquired
          </p>
          <p className="text-xs text-green-600 mt-1">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
          <p className="text-xs text-gray-500 mt-2">Redirecting to SMS/Contacts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-8">
        <button className="flex items-center justify-center gap-2 p-4 bg-white border shadow-sm rounded-xl hover:bg-gray-50">
          <Phone className="h-5 w-5 text-red-500" />
          <span className="font-semibold text-gray-700">Call Ambulance (108)</span>
        </button>
        <button className="flex items-center justify-center gap-2 p-4 bg-white border shadow-sm rounded-xl hover:bg-gray-50">
          <Phone className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-gray-700">Call Police (100)</span>
        </button>
      </div>
    </div>
  );
};

// 4. Medicine Order Component
const MedicineOrder = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (med) => {
    setCart([...cart, med]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    alert(`Order Placed Successfully! Total: ₹${getTotal()}\nWait for delivery partner confirmation.`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pharmacy Store</h2>
        <button
          onClick={() => setShowCart(true)}
          className="relative p-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <ShoppingCart className="h-6 w-6 text-gray-700" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MEDICINES.map((med) => (
          <div key={med.id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden group-hover:opacity-90 transition-opacity">
              <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-800">{med.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{med.category}</span>
              </div>
              <p className="font-bold text-green-600">₹{med.price}</p>
            </div>
            <button
              onClick={() => addToCart(med)}
              className="w-full mt-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add to Cart
            </button>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Your Cart</h3>
              <button onClick={() => setShowCart(false)}><X className="h-6 w-6" /></button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-green-600">₹{getTotal()}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Pill Reminders Component
const PillReminders = () => {
  const [reminders, setReminders] = useState([
    { id: 1, text: "Morning Diabetes Pill", time: "08:00", taken: false },
    { id: 2, text: "Vitamin C Supplement", time: "13:00", taken: false },
    { id: 3, text: "Night Heart Medicine", time: "21:00", taken: false },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedTime, setNewMedTime] = useState("");

  const toggleReminder = (id) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, taken: !r.taken } : r
    ));
  };

  const handleAddReminder = () => {
    if (newMedName && newMedTime) {
      const newReminder = {
        id: Date.now(),
        text: newMedName,
        time: newMedTime,
        taken: false
      };
      setReminders([...reminders, newReminder]);
      setNewMedName("");
      setNewMedTime("");
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Daily Reminders</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-green-600 font-medium hover:underline"
        >
          {isAdding ? "Cancel" : "+ Add New"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-3 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold text-green-800">Add New Reminder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Medicine Name (e.g. Aspirin)"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="time"
              value={newMedTime}
              onChange={(e) => setNewMedTime(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleAddReminder}
            disabled={!newMedName || !newMedTime}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Save Reminder
          </button>
        </div>
      )}

      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${reminder.taken ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 shadow-sm'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${reminder.taken ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'
                }`}>
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <p className={`font-semibold ${reminder.taken ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {reminder.text}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(`2000-01-01T${reminder.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleReminder(reminder.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reminder.taken
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              {reminder.taken ? 'Undo' : 'Mark Taken'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Profile State
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('sanjeevani_profiles');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'User', age: 65 }];
  });
  const [currentProfileId, setCurrentProfileId] = useState(() => {
    return localStorage.getItem('sanjeevani_current_profile_id') || '1';
  });

  // API Key State
  const [apiKey, setApiKey] = useState(() => {
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "PASTE_YOUR_KEY_HERE") {
      return GEMINI_API_KEY;
    }
    return localStorage.getItem('gemini_api_key') || '';
  });

  useEffect(() => {
    localStorage.setItem('sanjeevani_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('sanjeevani_current_profile_id', currentProfileId);
  }, [currentProfileId]);

  useEffect(() => {
    if (apiKey) localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  const handleAddProfile = (name) => {
    const newProfile = { id: Date.now().toString(), name, age: 60 };
    setProfiles([...profiles, newProfile]);
    setCurrentProfileId(newProfile.id);
  };

  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Namaste, {currentProfile.name}!</h2>
              <p className="opacity-90">Your vitals look good today. Don't forget your morning walk.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-blue-500" />
                  <h3 className="font-semibold text-gray-700">Heart Rate</h3>
                </div>
                <p className="text-3xl font-bold">72 <span className="text-sm text-gray-500 font-normal">bpm</span></p>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-red-500" />
                  <h3 className="font-semibold text-gray-700">Blood Pressure</h3>
                </div>
                <p className="text-3xl font-bold">120/80 <span className="text-sm text-gray-500 font-normal">mmHg</span></p>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-orange-500" />
                  <h3 className="font-semibold text-gray-700">Sugar Level</h3>
                </div>
                <p className="text-3xl font-bold">95 <span className="text-sm text-gray-500 font-normal">mg/dL</span></p>
              </div>
            </div>
            <PillReminders />
          </div>
        );
      case 'chat':
        return <Chatbot apiKey={apiKey} setApiKey={setApiKey} isHardcoded={!!GEMINI_API_KEY && GEMINI_API_KEY !== "PASTE_YOUR_KEY_HERE"} />;
      case 'sos':
        return <SOS />;
      case 'order':
        return <MedicineOrder />;
      case 'reminders':
        return <PillReminders />;
      default:
        return <div className="text-center py-10">Page Under Construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        profiles={profiles}
        currentProfileId={currentProfileId}
        setCurrentProfileId={setCurrentProfileId}
        onAddProfile={handleAddProfile}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-green-600 fill-current" />
            <span className="font-bold text-gray-800">Sanjeevani</span>
          </div>
          <button onClick={() => setIsMobileOpen(true)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;