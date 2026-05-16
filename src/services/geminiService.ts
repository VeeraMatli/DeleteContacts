
import { Contact } from "../types";

export async function smartFilterContacts(contacts: Contact[], criteria: string): Promise<string[]> {
  try {
    const response = await fetch("/api/gemini/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts, criteria }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch smart filter");
    }

    const data = await response.json();
    return data.ids || [];
  } catch (error) {
    console.error("Smart filtering client error:", error);
    return [];
  }
}
