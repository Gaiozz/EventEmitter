class EventEmitter {
    constructor () {
        this.listeners = []
        this._retainedEvents = {}
    }

    on (eventNames, func, dispatchRetainedEvent = false) {
        var namesArr = eventNames.trim().split(/ *, *| +/)
        var ret = []
        for (let i = 0; i < namesArr.length; i++) {
            let eventName = namesArr[i]

            if (!this.listeners[eventName.toLowerCase()]) {
                this.listeners[eventName.toLowerCase()] = []
            }
            this.listeners[eventName.toLowerCase()].push(func)

            dispatchEvent: if (dispatchRetainedEvent === true) {
                let event = this._retainedEvents[eventName]
                if (!event) break dispatchEvent

                func(...event.args)
            }

            ret.push(this.listeners[eventName.toLowerCase()].length - 1)
        }

        return namesArr.length == 1 ? ret[0] : ret
    }
    emit (eventNames, ...args) {
        var namesArr = eventNames.trim().split(/ *, *| +/)

        for (let i = 0; i < namesArr.length; i++) {
            let eventName = namesArr[i]

            this._retainedEvents[eventName] = { name: eventName, args }

            var arr = this.listeners[eventName.toLowerCase()]
            if (!arr) return

            for (let j = 0; j < arr.length; j++) {
                try {
                    arr[j](...args)
                }
                catch (err) {
                    console.error(`emit error (${eventName}): ${err}`)
                }
            }
        }
    }
    unbind (eventNames, index) {
        var namesArr = eventNames.trim().split(/ *, *| +/)

        if (namesArr.length === 1) {
            if (index != null) {
                this.listeners[eventName.toLowerCase()].splice(index, 1)
            }
            else {
                this.listeners[eventName.toLowerCase()] = []
            }
        }
        else {
            for (let i = 0; i < namesArr.length; i++) {
                this.listeners[eventName.toLowerCase()] = []
            }
        }
    }

    static unbind (eventNames, index = null) {
        GlobalEmitter.unbind(eventNames, index)
    }
    static emit (eventNames, ...args) {
        GlobalEmitter.emit(eventNames, ...args)
    }
    static on (eventNames, func, dispatchRetainedEvent) {
        return GlobalEmitter.on(eventNames, func, dispatchRetainedEvent)
    }
}

void function Init () {
    const GlobalEmitter = new EventEmitter()
}()
