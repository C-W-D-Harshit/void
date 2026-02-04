import { Video } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  time: string;
  meetLink: string;
}

// Mock data - in real extension this would come from Google Calendar API
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Sprint Planning",
    time: "10:00 AM",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    title: "1:1 with Sarah",
    time: "2:30 PM",
    meetLink: "https://meet.google.com/xyz-uvwx-rst",
  },
];

export function TodaysMeetings() {
  const meetings = mockMeetings;

  if (meetings.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-3.5 h-3.5 text-foreground/40" />
        <span className="text-xs text-foreground/40">Today</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {meetings.map((meeting) => (
          <a
            key={meeting.id}
            href={meeting.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-md bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            <span className="text-xs text-foreground/50 font-medium">
              {meeting.time}
            </span>
            <span className="text-xs text-foreground/70 group-hover:text-foreground/90 transition-colors">
              {meeting.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
