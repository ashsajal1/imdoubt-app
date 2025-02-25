import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function DoubtForm() {
  return (
    <div>
      <Label>Post a doubt.</Label>
      <Textarea placeholder="Enter your doubt statement eg, Internet is fake."></Textarea>
      <Button className="mt-3">Submit</Button>
    </div>
  );
}
