import React, { useState } from 'react';
import { WhatsAppContact } from '../../../types';
import { generateBotReply } from '../../../services/geminiService';
import { Send, Bot, User as UserIcon, MoreVertical, Smile } from 'lucide-react';

export const WhatsAppCRM: React.FC = () => {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([
    {
      id: '1',
      name: 'Maria Rodriguez',
      phone: '+57 300 123 4567',
      botEnabled: true,
      unreadCount: 1,
      lastMessage: 'Hola, quiero saber el precio.',
      messages: [
        { id: 'm1', sender: 'user', text: 'Hola, quiero saber el precio del curso.', timestamp: new Date(Date.now() - 3600000) }
      ]
    },
    {
      id: '2',
      name: 'Carlos Perez',
      phone: '+52 55 9876 5432',
      botEnabled: false,
      unreadCount: 0,
      lastMessage: 'Gracias, lo revisaré.',
      messages: [
        { id: 'm1', sender: 'user', text: '¿Tienen garantía?', timestamp: new Date(Date.now() - 86400000) },
        { id: 'm2', sender: 'agent', text: 'Sí Carlos, tienes 7 días de garantía.', timestamp: new Date(Date.now() - 86300000) },
        { id: 'm3', sender: 'user', text: 'Gracias, lo revisaré.', timestamp: new Date(Date.now() - 86000000) }
      ]
    }
  ]);

  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0].id);
  const [inputText, setInputText] = useState('');
  const [botLoading, setBotLoading] = useState(false);

  const selectedContact = contacts.find(c => c.id === selectedContactId)!;

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'agent' as const,
      text: inputText,
      timestamp: new Date()
    };

    updateMessages(selectedContactId, newMessage);
    setInputText('');
  };

  const updateMessages = (contactId: string, message: any) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          messages: [...c.messages, message],
          lastMessage: message.text,
          unreadCount: 0
        };
      }
      return c;
    }));
  };

  const simulateIncomingMessage = async () => {
    const msgText = "¿Tienen algún descuento disponible ahora?";
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: msgText,
      timestamp: new Date()
    };

    updateMessages(selectedContactId, newMessage);

    const currentContact = contacts.find(c => c.id === selectedContactId);
    if (currentContact?.botEnabled) {
      setBotLoading(true);
      try {
        const reply = await generateBotReply(msgText, "Venta de curso online de Marketing Digital. Precio $97. Oferta expira pronto.");
        const botMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot' as const,
          text: reply,
          timestamp: new Date()
        };
        setTimeout(() => {
           updateMessages(selectedContactId, botMessage);
           setBotLoading(false);
        }, 1500); 
      } catch (e) {
        setBotLoading(false);
      }
    }
  };

  const toggleBot = () => {
    setContacts(prev => prev.map(c => 
      c.id === selectedContactId ? { ...c, botEnabled: !c.botEnabled } : c
    ));
  };

  return (
    <div className="h-[calc(100vh-100px)] flex bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
      <div className="w-1/3 border-r border-gray-800 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 bg-gray-900">
          <h2 className="font-bold text-white">Chats de WhatsApp</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition ${
                selectedContactId === contact.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-200">{contact.name}</h4>
                {contact.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 truncate mt-1">{contact.lastMessage}</p>
              <div className="mt-2 flex items-center gap-2">
                 {contact.botEnabled && <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded flex items-center gap-1"><Bot className="w-3 h-3"/> Bot Activo</span>}
              </div>
            </div>
          ))}
        </div>
        <button onClick={simulateIncomingMessage} className="m-4 p-2 text-xs text-gray-500 border border-dashed border-gray-700 rounded hover:bg-gray-800">
          (Debug) Simular Mensaje Entrante
        </button>
      </div>

      <div className="w-2/3 flex flex-col bg-[#0b141a]">
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              {selectedContact.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white">{selectedContact.name}</h3>
              <p className="text-xs text-gray-400">{selectedContact.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBot}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                selectedContact.botEnabled 
                  ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Bot className="w-4 h-4" />
              {selectedContact.botEnabled ? 'Agente IA Activo' : 'Activar IA'}
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0b141a] opacity-100" style={{backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")'}}>
          {selectedContact.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-md text-sm relative ${
                  msg.sender === 'user'
                    ? 'bg-[#202c33] text-white rounded-tl-none'
                    : msg.sender === 'bot'
                    ? 'bg-purple-900 text-white rounded-tr-none'
                    : 'bg-[#005c4b] text-white rounded-tr-none'
                }`}
              >
                {msg.sender === 'bot' && (
                    <div className="absolute -top-3 right-0 bg-purple-600 text-white text-[10px] px-1.5 rounded-t flex items-center gap-1">
                        <Bot className="w-3 h-3" /> IA
                    </div>
                )}
                <p>{msg.text}</p>
                <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'bot' ? 'text-purple-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {botLoading && (
            <div className="flex justify-end">
               <div className="bg-purple-900/50 text-purple-300 px-4 py-2 rounded-full text-xs flex items-center gap-2 animate-pulse">
                  <Bot className="w-3 h-3" /> IA escribiendo...
               </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-800 flex items-center gap-2 border-t border-gray-700">
          <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-full">
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje"
            className="flex-1 p-2 rounded-lg bg-gray-700 border-none outline-none text-white placeholder-gray-400 focus:ring-1 focus:ring-gray-600"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 text-gray-400 hover:bg-gray-700 rounded-full"
          >
            <Send className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};