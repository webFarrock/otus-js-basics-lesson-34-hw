import { MessageType } from "../api/messages";

export const ActionsType = {
  ADD_MESSAGE: "ADD_MESSAGE",
  ADD_MESSAGES: "ADD_MESSAGES",
  SET_NICKNAME: "SET_NICKNAME",
  ERROR: "ERROR",
} as const;

export const addMessage = (payload: MessageType) => ({
  type: ActionsType.ADD_MESSAGE,
  payload,
});

export const addMessages = (payload: MessageType[]) => ({
  type: ActionsType.ADD_MESSAGES,
  payload,
});

export const login = (payload: string) => ({
  type: ActionsType.SET_NICKNAME,
  payload,
});

export const logout = () => ({
  type: ActionsType.SET_NICKNAME,
  payload: "",
});
