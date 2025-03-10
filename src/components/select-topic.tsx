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
import { Button } from "@/components/ui/button";
import { getAllTopics } from "@/actions/topics";
import { CreateTopicModal } from "./create-topic-modal";
import { Topic } from "@/lib/type";

interface SelectTopicProps {
  name: string;
  register: any;
  errors: any;
}

export function SelectTopic({ name, register, errors }: SelectTopicProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedTopicName, setSelectedTopicName] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSelect = (topicId: number, topicName: string) => {
    setSelectedTopicId(topicId);
    setSelectedTopicName(topicName);
    setIsOpen(false);
  };

  const handleTopicCreated = async () => {
    const data = await getAllTopics();
    setTopics(data);
    setSelectedTopicId(data[data.length - 1].id);
    setSelectedTopicName(data[data.length - 1].name);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            {selectedTopicName || "Select a topic"}
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
              <CommandItem onSelect={() => setIsModalOpen(true)}>
                + Create new topic
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" {...register(name)} value={selectedTopicId || ""} />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTopicCreated={handleTopicCreated}
      />
    </div>
  );
}
