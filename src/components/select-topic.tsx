"use client";

import { useState, useEffect } from "react";
import { useController, Control } from "react-hook-form";
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
import { DoubtInput } from "@/lib/validations/doubt";

interface SelectTopicProps {
  name: "content" | "topicId";
  control: Control<DoubtInput>;
  errors: any;
}

export function SelectTopic({ name, control, errors }: SelectTopicProps) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicName, setSelectedTopicName] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
    field.onChange(topicId); // Update form value directly
    setSelectedTopicName(topicName);
    setIsOpen(false);
  };

  const handleTopicCreated = async () => {
    const data = await getAllTopics();
    setTopics(data);
    const newTopic = data[data.length - 1];
    field.onChange(newTopic.id); // Update form value directly
    setSelectedTopicName(newTopic.name);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              {selectedTopicName || "Select a topic"}
            </Button>
          </PopoverTrigger>
          {errors[name] && (
            <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
          )}
        </div>
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

      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTopicCreated={handleTopicCreated}
      />
    </div>
  );
}
