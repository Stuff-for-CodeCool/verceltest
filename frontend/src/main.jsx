import React, { StrictMode, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const showDate = (someDate) => {
    const d = new Date(someDate);

    let y = d.getFullYear();
    let m = d.getMonth() + 1;
    m = m.toString().padStart(2, "0");
    let z = d.getDate();
    z = z.toString().padStart(2, "0");

    return `${y}-${m}-${z}`;
};

const App = () => {
    const [entries, setEntries] = useState([]);
    const ref = useRef(null);

    useEffect(() => {
        const loader = async () => {
            const req = await fetch("/api/entries");
            const res = await req.json();

            setEntries(res);
        };

        loader();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        const req = await fetch("/api/entries", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: ref.current.value.trim() }),
        });
        const res = await req.json();

        setEntries([res, ...entries]);
        ref.current.value = "";
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <label htmlFor="text">Text:</label>
                <textarea id="text" ref={ref}></textarea>
                <button type="submit">Add</button>
            </form>
            <ul>
                {entries.length === 0 ? (
                    <li>No entries</li>
                ) : (
                    entries.map((e) => (
                        <li key={e._id}>
                            {e.text} <small>{showDate(e.updatedAt)}</small>
                        </li>
                    ))
                )}
            </ul>
        </>
    );
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
