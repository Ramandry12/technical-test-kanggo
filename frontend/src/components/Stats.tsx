import React from "react";
import { type Task } from "../store/taskStore";
import { ListTodo, Clock, PlayCircle, CheckCircle2 } from "lucide-react";

interface StatsProps {
  tasks: Task[];
  totalFromMeta?: number;
}

const Stats: React.FC<StatsProps> = ({ tasks, totalFromMeta }) => {
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  const statItems = [
    {
      title: "Total Tugas Aktif",
      count: totalFromMeta ?? tasks.length,
      icon: <ListTodo className="w-5 h-5 text-indigo-400" />,
      glowColor: "shadow-indigo-500/10 border-indigo-500/20",
      bgColor: "from-indigo-500/5 to-transparent",
    },
    {
      title: "Pending",
      count: pending,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      glowColor: "shadow-amber-500/10 border-amber-500/20",
      bgColor: "from-amber-500/5 to-transparent",
    },
    {
      title: "Dalam Proses",
      count: inProgress,
      icon: <PlayCircle className="w-5 h-5 text-sky-400" />,
      glowColor: "shadow-sky-500/10 border-sky-500/20",
      bgColor: "from-sky-500/5 to-transparent",
    },
    {
      title: "Selesai",
      count: done,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      glowColor: "shadow-emerald-500/10 border-emerald-500/20",
      bgColor: "from-emerald-500/5 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`glass bg-gradient-to-br ${item.bgColor} border ${item.glowColor} rounded-2xl p-5 flex items-center justify-between shadow-lg transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {item.title}
            </span>
            <span className="font-heading text-3xl font-extrabold text-slate-100">
              {item.count}
            </span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/40">
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
