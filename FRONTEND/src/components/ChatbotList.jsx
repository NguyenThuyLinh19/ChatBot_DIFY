function ChatbotList({ chatbots }) {
    return (
        <div>
            <h2>Chatbots:</h2>
            <ul>
                {chatbots.map(bot => (
                    <li key={bot.id}>{bot.name} - {bot.description}</li>
                ))}
            </ul>
        </div>
    );
}

export default ChatbotList;
