'use client';

import {generateArguments} from '@/ai/flows/argument-generation';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Toaster, } from "@/components/ui/toaster"
import {useEffect, useState} from 'react';

const topics = [
  'Car-free city centers + public transport',
  'Computers in every classroom + computers for children + smartphones for children + smartphones at work + computers and career opportunities + computer skills',
  'Living with siblings + should young adults live alone at 18 + "Hotel Mama"',
  'Learning multiple languages + foreign languages',
  'Extreme sports + sports as a profession + sports schools + cycling',
  'Vacation in the home country or abroad + visiting relatives + traveling during vacation + vacation with family + beach holidays',
  'Musical instruments + music school + music in daily life',
  'Organic food + vegetarian food + cooked food or fast food + ready-made meals',
  'Trusting information on the internet',
  'Shopping online or in malls',
  'Finding true love on the internet',
  'Social networks',
  'Paths after school + studying in the home country or abroad',
  'Napping at noon – lunch break',
  'Smoking + smoking bans in public places/restaurants',
  'Living in the countryside or in the city',
  'School grades – their impact',
  'Household chores',
  'Pets',
  'Printed vs. e-books',
  'Parents choosing their children\'s clothes',
  'Working parents: are grandparents the solution? + childcare without kindergarten + kindergarten',
  'New or second-hand goods (second-hand clothing)',
  'Parks in the city',
  'Children vs. career + does work make us sick?',
  'Travel agencies or booking online',
  'Separating boys and girls in school',
  '24-hour open stores',
  'Celebrating festivals',
  'Do children have too little free time?',
  'Domestic violence',
];

const levels = ['A1', 'A2', 'B1', 'B2'] as const;

export default function Home() {
  const [topic, setTopic] = useState(topics[0]);
  const [level, setLevel] = useState(levels[0]);
  const [generatedArguments, setGeneratedArguments] = useState<
    {
      advantages: string[];
      disadvantages: string[];
    } | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedLevel = localStorage.getItem('cefrLevel') as typeof levels[number] | null;
    if (storedLevel) {
      setLevel(storedLevel);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cefrLevel', level);
  }, [level]);

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
  };

  const handleLevelChange = (newLevel: typeof levels[number]) => {
    setLevel(newLevel);
  };

  const handleArgumentGeneration = async () => {
    setLoading(true);
    try {
      const result = await generateArguments({topic: topic, cefrLevel: level});
      setGeneratedArguments(result);
      
    } catch (error: any) {
      console.error('Error generating arguments:', error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Toaster />
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>DeutschDisput</CardTitle>
          <CardDescription>
            Select a topic and CEFR level to generate arguments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label htmlFor="topic-select" className="block text-sm font-medium leading-6 text-gray-900">
              Select Topic:
            </label>
            <Select onValueChange={handleTopicChange} defaultValue={topic}>
              <SelectTrigger id="topic-select">
                <SelectValue placeholder="Select a topic"/>
              </SelectTrigger>
              <SelectContent>
                {topics.map((topicItem) => (
                  <SelectItem key={topicItem} value={topicItem}>
                    {topicItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="level-select" className="block text-sm font-medium leading-6 text-gray-900">
              CEFR Level:
            </label>
            <Select onValueChange={handleLevelChange} defaultValue={level}>
              <SelectTrigger id="level-select">
                <SelectValue placeholder="Select a level"/>
              </SelectTrigger>
              <SelectContent>
                {levels.map((levelItem) => (
                  <SelectItem key={levelItem} value={levelItem}>
                    {levelItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={handleArgumentGeneration}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Arguments'}
          </button>
        </CardContent>
      </Card>

      {generatedArguments && (
        <Accordion type="single" collapsible>
          <AccordionItem value="advantages">
            <AccordionTrigger>
              Vorteile <Badge>{generatedArguments.advantages.length}</Badge>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5">
                {generatedArguments.advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="disadvantages">
            <AccordionTrigger>
              Nachteile <Badge>{generatedArguments.disadvantages.length}</Badge>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5">
                {generatedArguments.disadvantages.map((disadvantage, index) => (
                  <li key={index}>{disadvantage}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
