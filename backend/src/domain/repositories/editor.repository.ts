import { Editor } from "../entities/editor"

export interface EditorRepository {
  findAll(): Promise<Editor[]>
  findById(id: number): Promise<Editor | null>
}
