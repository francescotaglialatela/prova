import { Ideas } from "../models/database.js";
import { Sequelize, Op, literal } from "sequelize";

export class IdeaController {
    
    static async saveIdea(req) {
        let idea = new Ideas({
            title: req.body.title,
            text: req.body.text,
            username: req.body.username
        });

        return idea.save();
    }

    /*
    static async getAllIdeas(){
        return Ideas.findAll({
            limit: 10,
            order: [[sequelize.literal('ABS(upVote - downVote)'), 'ASC'],
            ['createdAt', 'DESC']]
        });
    }
*/

/**Prende le prime 10 sempre */
static async getAllIdeas()
 {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calcola la data di una settimana fa
    
        const records = await Ideas.findAll({
          where: {
            createdAt: {
              [Op.gte]: oneWeekAgo // Filtra per la data dell'ultima settimana
            }
          },
          order: [
            // Ordina per numero di upVote e downVote più alto (sommando i due valori)
            [literal('upVote + downVote'), 'DESC'], 
    
            // Poi ordina per differenza tra upVote e downVote più vicina a zero
            [literal('ABS(upVote - downVote)'), 'ASC']
          ],
          limit: 10
        });
    
        
        return records;
      } catch (error) {
        console.error('Errore durante il recupero dei record:', error);
      }
 }

 /**Carica le altre controversial */
    static async getMoreIdeas(req,res) {

        let offset = req.params.offset;

        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calcola la data di una settimana fa
        
            const records = await Ideas.findAll({
              where: {
                createdAt: {
                  [Op.gte]: oneWeekAgo // Filtra per la data dell'ultima settimana
                }
              },
              order: [
                // Ordina per numero di upVote e downVote più alto (sommando i due valori)
                [literal('upVote + downVote'), 'DESC'], 
        
                // Poi ordina per differenza tra upVote e downVote più vicina a zero
                [literal('ABS(upVote - downVote)'), 'ASC']
              ],
              limit: offset
            });
        
           
            return records;
          } catch (error) {
            console.error('Errore durante il recupero dei record:', error);
          }
    }


    /**Unpopular */
    static async getUnpopularIdea() {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calcola la data di una settimana fa
        
            const records = await Ideas.findAll({
              where: {
                createdAt: {
                  [Op.gte]: oneWeekAgo // Filtra per la data dell'ultima settimana
                }
              },
              order: [
                // Ordina per minor numero di upVote o downVote
                [literal('CASE WHEN upVote < downVote THEN upVote ELSE downVote END'), 'ASC'],
                ['createdAt', 'DESC'] // Ordina anche per data di creazione decrescente
              ],
              limit: 10 // Limita il numero di record restituiti
            });
        
            console.log(records);
            return records;
          } catch (error) {
            console.error('Errore durante il recupero dei record:', error);
          }
    }

    static async getMoreUnpopular(req,res) {
        let offset = req.params.offset;

        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calcola la data di una settimana fa
        
            const records = await Ideas.findAll({
              where: {
                createdAt: {
                  [Op.gte]: oneWeekAgo // Filtra per la data dell'ultima settimana
                }
              },
              order: [
                // Ordina per minor numero di upVote o downVote
                [literal('CASE WHEN upVote < downVote THEN upVote ELSE downVote END'), 'ASC'],
                ['createdAt', 'DESC'] // Ordina anche per data di creazione decrescente
              ],
              limit: offset // Limita il numero di record restituiti
            });
        
            console.log(records);
            return records;
          } catch (error) {
            console.error('Errore durante il recupero dei record:', error);
          }
    }

    /** Mainstream*/
    static async getMainstreamIdea() {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calcola la data di una settimana fa
        
            const records = await Ideas.findAll({
              where: {
                createdAt: {
                  [Op.gte]: oneWeekAgo // Filtra per la data dell'ultima settimana
                }
              },
              order: [
                // Ordina per maggior numero di upVote o downVote
                [literal('CASE WHEN upVote > downVote THEN upVote ELSE downVote END'), 'DESC'],
                ['createdAt', 'DESC'] // Ordina anche per data di creazione decrescente
              ],
              limit: 10 // Limita il numero di record restituiti
            });
        
            console.log(records);
            return records;
          } catch (error) {
            console.error('Errore durante il recupero dei record:', error);
          }
        }

    
    static async getMoreMainstream(req,res) {
        let offset = req.params.offset;

        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calcola la data di una settimana fa
        
            const records = await Ideas.findAll({
              where: {
                createdAt: {
                  [Op.gte]: oneWeekAgo // Filtra per la data dell'ultima settimana
                }
              },
              order: [
                // Ordina per maggior numero di upVote o downVote
                [literal('CASE WHEN upVote > downVote THEN upVote ELSE downVote END'), 'DESC'],
                ['createdAt', 'DESC'] // Ordina anche per data di creazione decrescente
              ],
              limit: offset // Limita il numero di record restituiti
            });
        
            console.log(records);
            return records;
          } catch (error) {
            console.error('Errore durante il recupero dei record:', error);
          }
    }
    

    static async countIdeas(req) {
        return Ideas.count();
    }


    static async findTopIdeaOfDay() {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
    
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
    
      try {
        const topIdea = await Ideas.findOne({
          where: {
            createdAt: {
              [Op.between]: [startOfDay, endOfDay]
            }
          },
          order: [['upVote', 'DESC']]
        });
    
        return topIdea;
      } catch (error) {
        console.error('Errore nel trovare l\'idea con più upvote della giornata:', error);
      }
    }

    static async manualUpVote(req, res) {
      try {
          // Trova l'idea con l'ID passato come parametro
          const idea = await Ideas.findByPk(req.params.titleIdea);
          
          // Verifica se l'idea è stata trovata
          if (!idea) {
              return res.status(404).json({ message: 'Idea non trovata' });
          }
  
          // Aggiorna il valore del downVote
          idea.upVote = parseInt(req.params.vote, 10); // Assicurati che il valore sia un numero intero
  
          // Salva le modifiche
          await idea.save();
          
          // Invia una risposta positiva
          res.status(200).json({ message: 'upvote aggiornato con successo' });
      } catch (error) {
          // Gestisci eventuali errori
          console.error('Errore durante l\'aggiornamento del downvote:', error);
          res.status(500).json({ message: 'Errore interno del server' });
      }
  }
  

    static async manualDownVote(req, res) {
      try {
          // Trova l'idea con l'ID passato come parametro
          const idea = await Ideas.findByPk(req.params.titleIdea);
          
          // Verifica se l'idea è stata trovata
          if (!idea) {
              return res.status(404).json({ message: 'Idea non trovata' });
          }
  
          // Aggiorna il valore del downVote
          idea.downVote = parseInt(req.params.vote, 10); // Assicurati che il valore sia un numero intero
  
          // Salva le modifiche
          await idea.save();
          
          // Invia una risposta positiva
          res.status(200).json({ message: 'Downvote aggiornato con successo' });
      } catch (error) {
          // Gestisci eventuali errori
          console.error('Errore durante l\'aggiornamento del downvote:', error);
          res.status(500).json({ message: 'Errore interno del server' });
      }
  }
  

}