export default Grapoi
/**
 * A graph pointer object
 * @extends PathList
 */
declare class Grapoi extends PathList {
  _toTerm(value: any): any
  _toTermArray(values: any): any
  /**
   * Add quad(s) with the current terms as the object
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {Grapoi} this
   */
  addIn(
    predicates: Grapoi | Grapoi[] | Term | Term[],
    subjects?: Grapoi | Grapoi[] | Term | Term[],
    callback?: Function
  ): this
  /**
   * Add list(s) with the given items
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the lists
   * @param {Grapoi|Grapoi[]|Term|Term[]} [items] List items
   * @returns {Grapoi} this
   */
  addList(predicates: Grapoi | Grapoi[] | Term | Term[], items?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Add quad(s) with the current terms as the subject
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {Grapoi} this
   */
  addOut(
    predicates: Grapoi | Grapoi[] | Term | Term[],
    objects?: Grapoi | Grapoi[] | Term | Term[],
    callback?: Function
  ): this
  /**
   * Base all terms with a relative IRI with the given base.
   * @param {Grapoi|Grapoi[]|Term|Term[]} base Base of the terms
   * @returns {Grapoi} Instance with a single pointer with the term based
   */
  base(base: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Use the given score function on all pointers and return the pointer with the best score.
   * @param {function} score Score function
   * @returns {Grapoi} Instance with a single pointer with the best score
   */
  best(score: Function): this
  /**
   * Delete quad(s) with the current terms as the object.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @returns {Grapoi} this
   */
  deleteIn(predicates?: Grapoi | Grapoi[] | Term | Term[], subjects?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Delete list(s).
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the lists
   * @returns {Grapoi} this
   */
  deleteList(predicates?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Delete quad(s) with the current terms as the subject.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @returns {Grapoi} this
   */
  deleteOut(predicates: Grapoi | Grapoi[] | Term | Term[], objects?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Filter the pointers based on matching quad(s) with the current terms as the object.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @returns {Grapoi} Instance that contains only the filtered pointers
   */
  hasIn(predicates?: Grapoi | Grapoi[] | Term | Term[], subjects?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Filter the pointers based on matching quad(s) with the current terms as the subject.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @returns {Grapoi} Instance that contains only the filtered pointers
   */
  hasOut(predicates: Grapoi | Grapoi[] | Term | Term[], objects?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Traverse the graph with the current terms as the object.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [subjects] Subjects of the quads
   * @returns {Grapoi} Instance with pointers of the traversed target terms
   */
  in(predicates?: Grapoi | Grapoi[] | Term | Term[], subjects?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Traverse the graph with the current terms as the subject.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Predicates of the quads
   * @param {Grapoi|Grapoi[]|Term|Term[]} [objects] Objects of the quads
   * @returns {Grapoi} Instance with pointers of the traversed target terms
   */
  out(predicates?: Grapoi | Grapoi[] | Term | Term[], objects?: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Jump to random terms.
   * @param {Grapoi|Grapoi[]|Term|Term[]} predicates Terms for the new pointers
   * @returns {Grapoi} Instance with pointers of the selected terms
   */
  node(terms?: any): this
  /**
   * Rebase all terms of the current pointers with a new base.
   * @param {Grapoi|Grapoi[]|Term|Term[]} base New base of the terms
   * @returns {Grapoi} Instance with a single pointer with the new base as the term
   */
  rebase(base: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Replace all terms of the current pointers with another term.
   * @param {Grapoi|Grapoi[]|Term|Term[]} replacement Term used as replacement
   * @returns {Grapoi} Instance with a single pointer with the replacement as the term
   */
  replace(replacement: Grapoi | Grapoi[] | Term | Term[]): this
  /**
   * Score the pointers and sort them by score value.
   * @param {Function} score @rdfjs/score compatible score function
   * @param {Number} [limit] Limit for the result pointers
   * @param {Number} [offset] Offset for the result pointers
   * @returns {Grapoi} Instance of the scored pointers, sorted and sliced.
   */
  score(score: Function, { limit, offset }?: { limit: number; offset: number }): this
}
import { Term } from '@rdfjs/types'

import { Environment } from '@rdfjs/environment/Environment'
import { DatasetCore, Quad } from '@rdfjs/types'

/**
 * List of paths
 * @property {Array} ptrs All paths of this list
 */
declare class PathList {
  /**
   * Create a new instance
   * @param {DatasetCore} dataset Dataset for the pointers
   * @param {Environment} factory Factory for new quads
   * @param {Path[]} ptrs Use existing pointers
   * @param {Term[]} terms Terms for the pointers
   * @param {Term[]} graphs Graphs for the pointers
   */
  constructor({
    dataset,
    factory,
    ptrs,
    terms,
    graphs
  }: {
    dataset: DatasetCore
    factory: Environment<unknown>
    ptrs: PathList[]
    terms: Term[]
    graphs: Term[]
  })
  factory: DatasetCore
  ptrs: {
    dataset: DatasetCore
  }[]
  /**
   * Dataset of the pointer or null if there is no unique dataset.
   * @returns {DatasetCore|null} Unique dataset or null
   */
  get dataset(): DatasetCore | null
  /**
   * An array of all datasets of all pointers.
   * @returns {DatasetCore[]} Array of datasets.
   */
  get datasets(): DatasetCore[]
  /**
   * The term of the pointers if all pointers refer to a unique term.
   * @returns {Term|undefined} Term of undefined
   */
  get term(): any
  /**
   * An array of all terms of all pointers.
   * @returns {Term[]} Array of all terms
   */
  get terms(): Term[]
  /**
   * The value of the pointers if all pointers refer to a unique term.
   * @returns {String|undefined} Value or undefined
   */
  get value(): string
  /**
   * An array of all values of all pointers.
   * @returns {String[]} Array of all values
   */
  get values(): string[]
  /**
   * Add quads with the current terms as the object
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {PathList} this
   */
  addIn(predicates: Term[], subjects: Term[], callback?: Function): PathList
  /**
   * Add lists with the given items
   * @param {Term[]} predicates Predicates of the lists
   * @param {Term[]} items List items
   * @returns {PathList} this
   */
  addList(predicates: Term[], items: Term[]): PathList
  /**
   * Add quads with the current terms as the subject
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {PathList} this
   */
  addOut(predicates: Term[], objects: Term[], callback?: Function): PathList
  /**
   * Create a new instance of the Constructor with a cloned list of pointers.
   * @param args Additional arguments for the constructor
   * @returns {Constructor} Cloned instance
   */
  clone(args: any): this
  /**
   * Delete quads with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {PathList} this
   */
  deleteIn(predicates: Term[], subjects: Term[]): PathList
  /**
   * Delete lists.
   * @param {Term[]} predicates Predicates of the lists
   * @returns {PathList} this
   */
  deleteList(predicates: Term[]): PathList
  /**
   * Delete quads with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {PathList} this
   */
  deleteOut(predicates: Term[], objects: Term[]): PathList
  /**
   * Create a new instance with a unique set of pointers.
   * The path of the pointers is trimmed.
   * @returns {Constructor} Instance with unique pointers
   */
  distinct(): this
  /**
   * Executes a single instruction.
   * @param instruction The instruction to execute
   * @returns {Constructor} Instance with the result pointers.
   */
  execute(instruction: any): this
  /**
   * Executes an array of instructions.
   * @param instruction The instructions to execute
   * @returns {Constructor} Instance with the result pointers.
   */
  executeAll(instructions: any): this
  /**
   * Filter the pointers based on the result of the given callback function.
   * @param callback
   * @returns {Constructor} Instance with the filtered pointers.
   */
  filter(callback: (pointer: this) => boolean): this
  /**
   * Filter the pointers based on matching quad(s) with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasIn(predicates: Term[], subjects: Term[]): this
  /**
   * Filter the pointers based on matching quad(s) with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasOut(predicates: Term[], objects: Term[]): this
  /**
   * Traverse the graph with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  in(predicates: Term[], subjects: Term[]): this
  /**
   * Check if any pointer is an any-pointer.
   * @returns {boolean} True if any any-pointer was found
   */
  isAny(): boolean
  /**
   * Check if there is only one pointer and whether that pointer is a list.
   * @returns {boolean} True if the pointer is a list
   */
  isList(): boolean
  /**
   * Create an iterator for the list if the instance is a list; otherwise, return undefined.
   * @returns {Iterator<Constructor>|undefined} Iterator or undefined
   */
  list(): Iterator<this> | undefined
  /**
   * Map each pointer using the given callback function.
   * @param callback
   * @returns {Array} Array of mapped results
   */
  map(callback: any): any[]
  /**
   * Create a new instance with pointers using the given terms.
   * @param terms Array of terms for the pointers
   * @returns {Constructor} Instance with pointers of the given terms
   */
  node(terms: any): this
  /**
   * Traverse the graph with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  out(predicates: Term[], objects: Term[]): this
  /**
   * Create an iterator of all quads of all pointer paths.
   * @returns {Iterator<Quad>} Iterator for the quads
   */
  quads(): Quad[]
  /**
   * Trim the path of all pointers and create a new instance for the result.
   * @returns {Constructor} Instance of the trimmed pointers
   */
  trim(): this
  /**
   * Iterator for each pointer wrapped into a new instance.
   * @returns {Iterator<this>}} Iterator for the wrapped pointers
   */
  [Symbol.iterator](): Iterator<this>
}
