type LNode<T> = {
	value: T
	next?: LNode<T>
	prev?: LNode<T>
} | undefined

export class LList<T> {
	private _head: LNode<T> | undefined
	private _tail: LNode<T> | undefined
	private _length: number = 0

	constructor(arr: Array<T> = []) {
		arr.forEach( (value) => {
			this.add(value)
		})
	}

	private createNode(value: T, next?: LNode<T>, prev?: LNode<T>): LNode<T> {
		return {value, next, prev}
	}

	public add(value: T): LList<T> {
		if (this._tail) {
			this._tail.next = this.createNode(value, undefined, this._tail)
			this._tail = this._tail.next
		}
		else {
			this._head = this.createNode(value)
			this._tail = this._head
		}
		this._length++
		return this
	}

	public delete(value: T): boolean {
		const recursiveDelete = (node: LNode<T>): boolean => {
			if (!node) return false
			if (node.value === value) {
				if (node.prev) node.prev.next = node.next
				else this._head = node.next
				if (node.next) node.next.prev = node.prev
				else this._tail = node.prev
				this._length--
				return true
			}
			return recursiveDelete(node.next)
		}
		return recursiveDelete(this._head)
	}

	public at(index: number): T | undefined {
		const recursiveAt = (node: LNode<T>, currIndex: number): T | undefined => {
			if (currIndex === index) return node?.value
			return node ? recursiveAt(
				index >= 0 ? node?.next : node?.prev,
				index >= 0 ? currIndex + 1 : currIndex - 1
			) : undefined
		}
		if (index < 0 || index >= this._length) return undefined
		return recursiveAt(index >= 0 ? this._head : this._tail, index >= 0 ? 0 : -1)
	}

	public deleteAt(index: number): boolean {
    const recursiveDeleteAt = (node: LNode<T>, currIndex: number): boolean => {
			if (!node) return false
			if (currIndex === index) {
				if (node.prev) node.prev.next = node.next
				else this._head = node.next
				if (node.next) node.next.prev = node.prev
				else this._tail = node.prev
				this._length--
				return true
			}
			return recursiveDeleteAt(
				index >= 0 ? node?.next : node?.prev,
				index >= 0 ? currIndex + 1 : currIndex - 1
			)
    }
    return recursiveDeleteAt(index >= 0 ? this._head : this._tail, index >= 0 ? 0 : -1);
	}

	public indexOf(value: T): number {
		const recursiveIndexOf = (node: LNode<T>, currIndex: number): number => {
			if (!node) return -1
			if (node.value === value) return currIndex
			return recursiveIndexOf(node.next, currIndex + 1)
		}
		return recursiveIndexOf(this._head, 0);
	}

	public insert(value: T, index: number): boolean {
		const recursiveInsert = (node: LNode<T>, currIndex: number): boolean => {
			if (node && currIndex === index) {
				const newNode = this.createNode(value, node, node?.prev)
				if (node?.prev) node.prev.next = newNode
				else this._head = newNode
				node.prev = newNode
				this._length++
				return true
			}
			else if (node?.next) return recursiveInsert(node.next, currIndex + 1)
			else if (node) {
				const newNode = this.createNode(value, undefined, node)
				node.next = newNode
				this._tail = newNode
				this._length++
				return true
			}
			else return false
		}
		if (index < 0 || index > this._length) return false
		return recursiveInsert(this._head, 0)
	}

	public values(): Array<T> {
		function recursiveValues(node: LNode<T>, arr: Array<T>): Array<T> {
			if (node) arr.push(node.value)
			if (node && node.next) return recursiveValues(node.next, arr)
			return arr
		}
		return recursiveValues(this._head, [])
	}

	public has(value: T): boolean {
		function recursiveHas(node: LNode<T>, value: T) {
			if (node && node.value === value) return true
			if (node && node.next) return recursiveHas(node.next, value)
			return false
		}
		return recursiveHas(this._head, value)
	}

	public clear(): void {
		this._head = undefined
		this._tail = undefined
		this._length = 0
	}

	public isEmpty(): boolean {
		return !this._head
	}

	get size(): number {
		return this._length
	}

	private toString(): string {
		return this.values().toString()
	}
	private toJSON(): Array<T> {
		return this.values()
	}
	private valueOf(): number {
		return this.size
	}
}
