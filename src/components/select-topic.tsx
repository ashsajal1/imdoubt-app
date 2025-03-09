"use client";

import { useState, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getAllTopics } from "@/actions/topics";

interface SelectTopicProps {
  name: string;
  label: string;
  register: any;
  errors: any;
}

export function SelectTopic({
  name,
  label,
  register,
  errors,
}: SelectTopicProps) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch topics from the server
    async function fetchTopics() {
      try {
        const data = await getAllTopics();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }

    fetchTopics();
  }, []);

  const handleSelect = (topicId: string, topicName: string) => {
    setSelectedTopic(topicName);
    setIsOpen(false);
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            {selectedTopic || "Select a topic"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search topics..." />
            <CommandList>
              {topics.map((topic) => (
                <CommandItem
                  key={topic.id}
                  onSelect={() => handleSelect(topic.id, topic.name)}
                >
                  {topic.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" {...register(name)} value={selectedTopic || ""} />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
