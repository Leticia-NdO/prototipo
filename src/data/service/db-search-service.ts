import { EntryRegistry } from '../../domain/models/entry-registry'
import { SearchService } from '../../domain/service/search-service'
import { SearchRepository } from '../../domain/repository/search-repository'

/* This class is the implementation of the SearchService interface that the MainController requires, therefore,
we can pass it as a parameter to MainController  */
export class DbSearchService implements SearchService {
  private readonly searchRepository: SearchRepository

  constructor (searchRepository: SearchRepository) {
    this.searchRepository = searchRepository
  }

  async get (offset: number, limit: number): Promise<EntryRegistry[]> {
    // it simply calls the SearchRepository with the aproppietead parameteres
    const res = await this.searchRepository.get(limit, offset)
    return res
  }
}
