import { useDispatch, useSelector } from 'react-redux';

// 将来的にTypeScriptに移行するためhooks化しておく
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
