import { Reducer } from "redux";
import { ActionsType } from "./actions";
import { MessageType } from "../api/messages";

export type State = {
  nickname: string;
  messages: MessageType[];
  error: Error | null;
};

export const initialState: State = {
  nickname: "",
  messages: [],
  error: null,
};

export const reducer: Reducer<State> = (state = initialState, action = { type: undefined }) => {
  switch (action.type) {
    case ActionsType.ADD_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case ActionsType.ADD_MESSAGE:
      return {
        ...state,
        messages: [action.payload, ...state.messages],
      };
    case ActionsType.SET_NICKNAME:
      return {
        ...state,
        nickname: action.payload,
        error: null,
      };
    case ActionsType.ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};
