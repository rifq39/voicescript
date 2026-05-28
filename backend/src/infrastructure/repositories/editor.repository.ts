import { PrismaClient } from "@prisma/client"
import { Editor } from "../../domain/entities/editor"
import { EditorRepository } from "../../domain/repositories/editor.repository"

export class PrismaEditorRepository implements EditorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Editor[]> {
    return this.prisma.editor.findMany({ orderBy: { name: "asc" } })
  }

  async findById(id: number): Promise<Editor | null> {
    return this.prisma.editor.findUnique({ where: { id } })
  }
}
