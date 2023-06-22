import callApi from '../helpers/apiHelper';

const getDetailesEndPoint = id => `details/fighter/${id}.json`;
class FighterService {
    #endpoint = 'fighters.json';

    #detailesEndPoint = getDetailesEndPoint;

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // endpoint - `details/fighter/${id}.json`;
        try {
            const apiResult = await callApi(this.#detailesEndPoint(id));
            return apiResult;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
