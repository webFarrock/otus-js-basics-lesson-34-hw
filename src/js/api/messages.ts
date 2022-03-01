export type MessageType = {
  message: string;
  nickname?: string;
  date?: string | number;
};

const config = {
  firebaseBaseUrl: "https://otus-js-chat-4ed79-default-rtdb.firebaseio.com",
  firebaseCollection: "messages.json",
};

export async function sendMessage(data: MessageType) {
  return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      date: new Date(),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function observeWithEventSource(cb: Function) {
  const evtSource = new EventSource(`${config.firebaseBaseUrl}/${config.firebaseCollection}`);

  evtSource.addEventListener("put", (ev: any) => {
    const data = JSON.parse(ev.data).data;
    cb(data);
  });
}
