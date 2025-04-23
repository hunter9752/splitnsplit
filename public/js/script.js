// View Details functionality for join-split page
document.addEventListener('DOMContentLoaded', function() {
    // Get all "View Details" buttons
    const viewDetailsButtons = document.querySelectorAll('.group-card .btn-outline');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the parent group card
            const groupCard = this.closest('.group-card');
            
            // Get group details
            const groupDetails = {
                name: groupCard.querySelector('h3').textContent,
                image: groupCard.querySelector('img').src,
                category: groupCard.querySelector('.group-tag').textContent,
                capacity: groupCard.querySelector('.capacity span').textContent,
                host: groupCard.querySelector('.detail:nth-child(1) span').textContent,
                created: groupCard.querySelector('.detail:nth-child(2) span').textContent,
                closing: groupCard.querySelector('.detail:nth-child(3) span').textContent,
                cost: groupCard.querySelector('.detail:nth-child(4) span').textContent,
                description: groupCard.querySelector('.group-description').textContent
            };
            
            // Show modal with details
            const modal = document.getElementById('splitDetailsModal');
            const content = document.getElementById('splitDetailsContent');
            
            content.innerHTML = `
                <div class="split-details-card">
                    <div class="split-header">
                        <img src="${groupDetails.image}" alt="${groupDetails.name}">
                        <h3>${groupDetails.name}</h3>
                        <span class="split-badge">${groupDetails.category}</span>
                    </div>
                    
                    <div class="split-info">
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span><strong>Capacity:</strong> ${groupDetails.capacity}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <span><strong>Host:</strong> ${groupDetails.host}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <span><strong>Created:</strong> ${groupDetails.created}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span><strong>Closing:</strong> ${groupDetails.closing}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span><strong>Your Cost:</strong> ${groupDetails.cost}</span>
                        </div>
                    </div>
                    
                    <div class="split-description">
                        <h4>About This Group</h4>
                        <p>${groupDetails.description}</p>
                    </div>
                    
                    <div class="split-features">
                        <h4>Group Rules</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Regular monthly payments required</li>
                            <li><i class="fas fa-check"></i> Active participation expected</li>
                            <li><i class="fas fa-check"></i> 30-day notice for leaving group</li>
                            <li><i class="fas fa-check"></i> Follow platform guidelines</li>
                        </ul>
                    </div>
                    
                    <div class="split-actions">
                        <a href="#" class="btn btn-primary" onclick="joinGroup('${groupCard.id}')">Join This Group</a>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        });
    });
    
    // Close modal functionality
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Join group functionality
function joinGroup(groupId) {
    // Here you can add the logic to join the group
    alert('Joining group: ' + groupId);
    // You can redirect to payment page or show payment modal
    window.location.href = 'join-deal.html?group=' + groupId;
} 