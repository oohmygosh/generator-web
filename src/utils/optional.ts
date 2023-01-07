export class Optional<T> {

    private readonly value: T;

    private constructor(obj: T) {
        this.value = obj
    }

    static ofNullable<T>(obj: T) {
        return new Optional(obj)
    }

    isPresent = () => {
        return !Optional.isNull(this.value)
    }

    isEmpty = () => {
        return Optional.isNull(this.value)
    }

    ifPresent = (action: (value: T) => void) => {
        if (this.isPresent())
            action(this.value)
    }

    orElseGet = (supplier: () => T) => {
        return Optional.isNull(this.value) ? supplier() : this.value
    }

    orElse = (supplier: () => void) => {
        return Optional.isNull(this.value) ? supplier() : this.value
    }

    orElseThrow = (msg:string) => {
        if (Optional.isNull(this.value))
            throw msg
        return this.value
    }

    ifPresentOrElse = (action: (value: T) => void, emptyAction: () => void) => {
        if (this.isPresent())
            action(this.value)
        else
            emptyAction()
    }

    ifPresentOrThrow = (action: (value: T) => void, msg:string) => {
        if (this.isPresent())
            action(this.value)
        else
            throw msg
    }


    get = () => {
        if (Optional.isNull(this.value))
            throw "No value present!"
        return this.value
    };

    private static isNull(obj: any) {
        return typeof obj === 'undefined' || obj === null
    }
}