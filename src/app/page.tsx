
'use client';

import {generateArguments} from '@/ai/flows/argument-generation';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useToast} from "@/hooks/use-toast"
import {useEffect, useState} from 'react';

const topics = [
  'Stadtzentrum ohne Autos + öffentliche Verkehrsmittel',
  'Computer für jeden Kursraum + Computer für Kinder + Handy für Kinder + Handy in der Firma + computer und berufchancen + computerkenntnisse',
  'Leben mit geschwister + sollten jugendlichen mit 18 alleine leben + hotel mama',
  'Mehrere sprachen lernen + fremdsprachen',
  'Extrem sport + sport als beruf + sportschule + Fahrrad',
  'Urlaub in heimatland oder ausland + urlaub bei verwandten + im urlaub verreisen + urlaub mit famillie + urlaub am strand',
  'Musikinstrument + musik schule + musik im alltag',
  'Bio essen + vegetarische essen + gekochtes essen oder fastfood + fertig essen',
  'Glauben information im internet',
  'Einkaufen im internet oder einkaufzentrum',
  'Grosse liebe im internet',
  'Soziale netzwerk',
  'Wege nach der schule + studieren im heimatland oder ausland',
  'Mittag schlafen – mittagspause',
  'Rauchen + rauchen verboten an offentlichen orten/resturants',
  'Leben auf dem land oder in der stadt',
  'Schulnoten auswirkungen',
  'Haushalt',
  'Haustier',
  'Gedruckte oder E bucher',
  'Die eltern Klammoten entscheiden',
  'Berufstätige Eltern: sind Großeltern die Lösung + betreung von kinder ohne kindergarten + kindergarten',
  'Neue oder gebrauchte Ware(Second-Hand Kleidung)',
  'Parks in der stadt',
  'Kinder oder karrier + arbeit macht uns krank',
  'Reise buro oder online buchen',
  'Jungen und Mädchen in der Schule trennen',
  '24 stunden geoffnet geschafte',
  'Feste feiern',
  'Haben kinder wenig freizeit',
  'Gewalt in der familie',
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
  const { toast } = useToast()

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
      toast({
        title: "Arguments Generated!",
        description: "Your arguments have been successfully generated.",
      })
      
    } catch (error: any) {
      console.error('Error generating arguments:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error generating the arguments. Please try again.",
      })
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <div className="container max-w-3xl p-4">
      <Card className="mb-8 rounded-lg shadow-md transition-colors duration-300">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">DeutschDisput</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select a topic and CEFR level to generate arguments for practicing German.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <div>
            <label htmlFor="topic-select" className="block text-sm font-medium text-foreground">
              Select Topic:
            </label>
            <Select onValueChange={handleTopicChange} defaultValue={topic}>
              <SelectTrigger id="topic-select" className="bg-background border-input rounded-md">
                <SelectValue placeholder="Select a topic"/>
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border rounded-md shadow-md">
                {topics.map((topicItem) => (
                  <SelectItem key={topicItem} value={topicItem} className="hover:bg-accent hover:text-accent-foreground">
                    {topicItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="level-select" className="block text-sm font-medium text-foreground">
              CEFR Level:
            </label>
            <Select onValueChange={handleLevelChange} defaultValue={level}>
              <SelectTrigger id="level-select" className="bg-background border-input rounded-md">
                <SelectValue placeholder="Select a level"/>
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border rounded-md shadow-md">
                {levels.map((levelItem) => (
                  <SelectItem key={levelItem} value={levelItem} className="hover:bg-accent hover:text-accent-foreground">
                    {levelItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={handleArgumentGeneration}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Arguments'}
          </button>
        </CardContent>
      </Card>

      {generatedArguments && (
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advantages" className="border-b border-border">
              <AccordionTrigger className="py-4 font-medium text-lg hover:underline flex items-center justify-between w-full">
                Vorteile <Badge className="ml-2 bg-secondary text-secondary-foreground">{generatedArguments.advantages.length}</Badge>
              </AccordionTrigger>
              <AccordionContent className="py-4">
                <ul className="list-disc pl-5">
                  {generatedArguments.advantages.map((advantage, index) => (
                    <li key={index} className="mb-2">{advantage}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="disadvantages" className="border-b border-border">
              <AccordionTrigger className="py-4 font-medium text-lg hover:underline flex items-center justify-between w-full">
                Nachteile <Badge className="ml-2 bg-secondary text-secondary-foreground">{generatedArguments.disadvantages.length}</Badge>
              </AccordionTrigger>
              <AccordionContent className="py-4">
                <ul className="list-disc pl-5">
                  {generatedArguments.disadvantages.map((disadvantage, index) => (
                    <li key={index} className="mb-2">{disadvantage}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      </div>
    </div>
  );
}
