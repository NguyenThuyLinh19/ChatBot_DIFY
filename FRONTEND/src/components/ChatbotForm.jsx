import { useState } from "react";
import axios from "axios";

function ChatbotForm({ onChatbotCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const createChatbot = () => {
        axios.post("http://localhost:5000/create-chatbot", { name, description })
            .then(res => {
                alert("Chatbot created!");
                onChatbotCreated(res.data);
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <input type="text" placeholder="Chatbot Name" onChange={e => setName(e.target.value)} />
            <input type="text" placeholder="Description" onChange={e => setDescription(e.target.value)} />
            <button onClick={createChatbot}>Create Chatbot</button>
        </div>
    );
}

export default ChatbotForm;
