// Utils
import MapManager from '@/utils/MapManager';

export default ({ app, store }, inject) => {
    const mapManager = new MapManager();
    inject('mapManager', mapManager);

    mapManager.addEventListener('change', (e) => {
        const settlers = e.settlers;
        const resources = e.resources;
        const populations = e.populations;
        const chunks = e.chunks;
    });
};
