class MistralAPI {
    constructor() {
        this.baseUrl = 'https://admin.mistral.ai/organization/api-keys';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async getAPIKeys() {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching API keys:', error);
            throw error;
        }
    }

    async createAPIKey(keyData) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(keyData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating API key:', error);
            throw error;
        }
    }

    async deleteAPIKey(keyId) {
        try {
            const response = await fetch(`${this.baseUrl}/${keyId}`, {
                method: 'DELETE',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting API key:', error);
            throw error;
        }
    }

    async updateAPIKey(keyId, keyData) {
        try {
            const response = await fetch(`${this.baseUrl}/${keyId}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(keyData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating API key:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MistralAPI;
}