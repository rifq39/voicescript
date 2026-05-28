import { Editor } from '../../../domain/entities/editor';
import { EditorRepository } from '../../../domain/repositories/editor.repository';

export class ListEditorsUseCase {
  constructor(private readonly editorRepository: EditorRepository) {}

  async execute(): Promise<Editor[]> {
    return this.editorRepository.findAll();
  }
}
