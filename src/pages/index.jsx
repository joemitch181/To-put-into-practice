
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);

  const handleAsk = () => {
    if (!query.trim()) return;
    const newResponse = {
      id: responses.length + 1,
      text: `AI Response to: "${query}"`,
    };
    setResponses([...responses, newResponse]);
    setQuery('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-purple-50 to-blue-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        To Put Into Practice
      </h1>

      <div className="w-full max-w-xl flex gap-2 mb-6">
        <Input
          placeholder="Ask the AI something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-lg"
        />
        <Button onClick={handleAsk} className="text-lg">Ask</Button>
      </div>

      <div className="w-full max-w-2xl grid gap-4">
        {responses.map((resp) => (
          <motion.div
            key={resp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-4 text-gray-700 text-lg">
                {resp.text}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
