export interface ILogger {

    logger : unknown;

    log : (...args : unknown[]) => void;

    error : (...args : unknown[]) => void;

    warning : (...args : unknown[]) => void;

}
