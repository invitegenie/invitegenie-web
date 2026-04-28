import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

export default function Tasks() {
  const navigate = useNavigate();

  const tasks = [
    { title: "Send final payment reminder", event: "Emma & Liam's Wedding", completed: false },
    { title: "Confirm seating plan updates", event: "Emma & Liam's Wedding", completed: false },
    { title: "Review guest list updates", event: "Hope for All Charity Gala", completed: false },
    { title: "Contact DJ vendor", event: "Clay's Birthday Party", completed: true },
    { title: "Finalize catering menu", event: "Brann's Birthday Party", completed: true },
  ];

  return (
    <div className="space-y-5">
      <div className="mb-8 flex items-center gap-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-white/5 p-2 hover:bg-white/10"
        >
          <Icon name="arrow_back" className="text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl"
          >
            <input
              type="checkbox"
              defaultChecked={task.completed}
              className="mt-1 h-5 w-5 rounded border-white/20 text-purple-600"
            />
            <div className="flex-1">
              <p className={`font-medium ${task.completed ? "line-through text-slate-400" : "text-white"}`}>
                {task.title}
              </p>
              <p className="text-sm text-purple-300">{task.event}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/profile")}
        className="mt-8 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-2 font-bold text-white"
      >
        Back to Profile
      </button>
    </div>
  );
}
