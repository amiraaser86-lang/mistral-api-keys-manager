document.addEventListener('DOMContentLoaded', function() {
    const api = new MistralAPI();
    const keysList = document.getElementById('keysList');
    const addKeyBtn = document.getElementById('addKeyBtn');
    const modal = document.getElementById('keyFormModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const apiKeyForm = document.getElementById('apiKeyForm');
    const notification = document.getElementById('notification');
    const modalTitle = document.getElementById('modalTitle');

    let editingKeyId = null;

    // Load API keys on page load
    loadAPIKeys();

    // Event listeners
    addKeyBtn.addEventListener('click', () => {
        editingKeyId = null;
        modalTitle.textContent = 'Add New API Key';
        apiKeyForm.reset();
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    apiKeyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const keyName = document.getElementById('keyName').value;
        const keyDescription = document.getElementById('keyDescription').value;
        const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(cb => cb.value);

        const keyData = {
            name: keyName,
            description: keyDescription,
            permissions: permissions
        };

        try {
            if (editingKeyId) {
                // Update existing key
                await api.updateAPIKey(editingKeyId, keyData);
                showNotification('API key updated successfully!', 'success');
            } else {
                // Create new key
                await api.createAPIKey(keyData);
                showNotification('API key created successfully!', 'success');
            }

            // Refresh the list
            loadAPIKeys();
            modal.style.display = 'none';
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        }
    });

    // Functions
    async function loadAPIKeys() {
        keysList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading keys...</div>';

        try {
            const keys = await api.getAPIKeys();
            displayKeys(keys);
        } catch (error) {
            keysList.innerHTML = `<div class="error">Failed to load API keys: ${error.message}</div>`;
        }
    }

    function displayKeys(keys) {
        if (!keys || keys.length === 0) {
            keysList.innerHTML = '<div class="no-keys">No API keys found. Click "Add New API Key" to create one.</div>';
            return;
        }

        let html = '';
        keys.forEach(key => {
            html += `
                <div class="key-item">
                    <div class="key-info">
                        <h3>${key.name || 'Unnamed Key'}</h3>
                        <p>${key.description || 'No description'}</p>
                        <small>Permissions: ${key.permissions ? key.permissions.join(', ') : 'None'}</small>
                    </div>
                    <div class="key-actions">
                        <button class="btn edit" data-id="${key.id}" data-name="${key.name}" data-desc="${key.description}" data-permissions="${key.permissions || ''}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn delete" data-id="${key.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });

        keysList.innerHTML = html;

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.key-actions .edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const keyId = e.target.closest('.edit').dataset.id;
                const keyName = e.target.closest('.edit').dataset.name;
                const keyDesc = e.target.closest('.edit').dataset.desc;
                const keyPermissions = e.target.closest('.edit').dataset.permissions.split(',');

                editingKeyId = keyId;
                modalTitle.textContent = 'Edit API Key';

                document.getElementById('keyName').value = keyName;
                document.getElementById('keyDescription').value = keyDesc;

                // Set permissions checkboxes
                document.querySelectorAll('input[name="permissions"]').forEach(cb => {
                    cb.checked = keyPermissions.includes(cb.value);
                });

                modal.style.display = 'flex';
            });
        });

        document.querySelectorAll('.key-actions .delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const keyId = e.target.closest('.delete').dataset.id;

                if (confirm('Are you sure you want to delete this API key?')) {
                    try {
                        await api.deleteAPIKey(keyId);
                        showNotification('API key deleted successfully!', 'success');
                        loadAPIKeys();
                    } catch (error) {
                        showNotification(`Error: ${error.message}`, 'error');
                    }
                }
            });
        });
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
});