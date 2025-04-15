'use client';

import {generateArguments} from '@/ai/flows/argument-generation';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Toaster, } from "@/components/ui/toaster"
import {useEffect, useState} from 'react';

const topics = [
  'Autofreie Innenstädte + öffentlicher Verkehr',
  'Computer in jedem Klassenzimmer + Computer für Kinder + Smartphones für Kinder + Smartphones bei der Arbeit + Computer und Karrierechancen + Computerkenntnisse',
  'Mit Geschwistern leben + Sollten junge Erwachsene mit 18 Jahren alleine leben + "Hotel Mama"',
  'Mehrere Sprachen lernen + Fremdsprachen',
  'Extremsportarten + Sport als Beruf + Sportschulen + Radfahren',
  'Urlaub im In- oder Ausland + Verwandte besuchen + Reisen im Urlaub + Urlaub mit der Familie + Strandurlaub',
  'Musikinstrumente + Musikschule + Musik im Alltag',
  'Bio-Lebensmittel + vegetarisches Essen + Gekochtes oder Fast Food + Fertiggerichte',
  'Informationen im Internet vertrauen',
  'Online-Shopping oder in Einkaufszentren',
  'Wahre Liebe im Internet finden',
  'Soziale Netzwerke',
  'Wege nach der Schule + Studieren im In- oder Ausland',
  'Mittagsschlaf – Mittagspause',
  'Rauchen + Rauchverbote an öffentlichen Orten/Restaurants',
  'Leben auf dem Land oder in der Stadt',
  'Schulnoten – ihre Auswirkungen',
  'Hausarbeiten',
  'Haustiere',
  'Gedruckte vs. E-Books',
  'Eltern wählen die Kleidung ihrer Kinder',
  'Berufstätige Eltern: Sind Großeltern die Lösung? + Kinderbetreuung ohne Kindergarten + Kindergarten',
  'Neue oder gebrauchte Waren (Second-Hand-Kleidung)',
  'Parks in der Stadt',
  'Kinder vs. Karriere + Macht Arbeit uns krank?',
  'Reisebüros oder Online-Buchung',
  'Jungen und Mädchen in der Schule trennen',
  '24-Stunden-geöffnete Geschäfte',
  'Feste feiern',
  'Haben Kinder zu wenig Freizeit?',
  'Häusliche Gewalt',
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
