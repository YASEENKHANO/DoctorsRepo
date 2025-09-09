
        // Sample data - in a real app, this would come from a database
        let doctors = [
            {
                name: "Dr. Muhammad Tariq",
                specialty: "Cardiology",
                clinic: "Bannu Heart Center",
                timing: "Mon-Wed: 9:00 AM - 2:00 PM",
                phone: "+92 300 1234567",
               
                isAvailable: true
            },
            {
                name: "Dr. Fatima Shah",
                specialty: "Pediatrics",
                clinic: "Children's Medical Center",
                timing: "Tue-Thu: 10:00 AM - 3:00 PM",
                phone: "+92 301 2345678",
               
                isAvailable: true
            },
            {
                name: "Dr. Ahmad Khan",
                specialty: "Neurology",
                clinic: "Bannu Neuro Clinic",
                timing: "Wed-Fri: 11:00 AM - 4:00 PM",
                phone: "+92 302 3456789",
               
                isAvailable: false
            },
            {
                name: "Dr. Ayesha Malik",
                specialty: "Gynecology",
                clinic: "Women's Health Center",
                timing: "Mon-Fri: 2:00 PM - 6:00 PM",
                phone: "+92 303 4567890",
             
                isAvailable: true
            },
            {
                name: "Dr. Hassan Ali",
                specialty: "Orthopedics",
                clinic: "Bone & Joint Clinic",
                timing: "Sat-Sun: 8:00 AM - 1:00 PM",
                phone: "+92 304 5678901",
                
                isAvailable: false
            },
            {
                name: "Dr. Zainab Khattak",
                specialty: "Dermatology",
                clinic: "Skin Care Center",
                timing: "Mon, Wed, Fri: 3:00 PM - 7:00 PM",
                phone: "+92 305 6789012",
                
                isAvailable: true
            }
        ];

        let filteredDoctors = [...doctors];

        // Initialize the app
        function init() {
            renderDoctors();
            updateStats();
            populateFilters();
            initializeCharts();
            setupEventListeners();
        }

        // Render doctors cards
        function renderDoctors() {
            const grid = document.getElementById('doctorsGrid');
            const noResults = document.getElementById('noResults');
            
            if (filteredDoctors.length === 0) {
                grid.style.display = 'none';
                noResults.style.display = 'block';
                return;
            }
            
            grid.style.display = 'grid';
            noResults.style.display = 'none';
            
            grid.innerHTML = filteredDoctors.map(doctor => `
                <div class="doctor-card">
                    <div class="doctor-header">
                        <div class="doctor-avatar">
                            ${doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div class="doctor-info">
                            <h3>${doctor.name}</h3>
                            <div class="doctor-specialty">${doctor.specialty}</div>
                        </div>
                    </div>
                    <div class="doctor-details">
                        <div class="detail-row">
                            <span class="detail-icon">🏥</span>
                            <span class="detail-text">${doctor.clinic}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-icon">🕒</span>
                            <span class="detail-text">${doctor.timing}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-icon">📞</span>
                            <span class="detail-text">${doctor.phone || 'Not provided'}</span>
                        </div>
                       
                    </div>
                    <div class="availability-badge ${doctor.isAvailable ? 'available' : 'unavailable'}">
                        ${doctor.isAvailable ? '✅ Available Today' : '❌ Not Available'}
                    </div>
                </div>
            `).join('');
        }

        // Update statistics
        function updateStats() {
            document.getElementById('totalDoctors').textContent = doctors.length;
            document.getElementById('availableToday').textContent = doctors.filter(d => d.isAvailable).length;
            document.getElementById('specialties').textContent = new Set(doctors.map(d => d.specialty)).size;
            document.getElementById('clinics').textContent = new Set(doctors.map(d => d.clinic)).size;
        }

        // Populate filter dropdowns
        function populateFilters() {
            const specialtyFilter = document.getElementById('specialtyFilter');
            const specialties = [...new Set(doctors.map(d => d.specialty))].sort();
            
            specialtyFilter.innerHTML = '<option value="">All Specialties</option>' + 
                specialties.map(s => `<option value="${s}">${s}</option>`).join('');
        }

        // Initialize charts
        function initializeCharts() {
            // Specialty Chart
            const specialtyData = doctors.reduce((acc, doctor) => {
                acc[doctor.specialty] = (acc[doctor.specialty] || 0) + 1;
                return acc;
            }, {});

            new Chart(document.getElementById('specialtyChart'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(specialtyData),
                    datasets: [{
                        data: Object.values(specialtyData),
                        backgroundColor: [
                            '#667eea', '#764ba2', '#f093fb', '#f5576c',
                            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                            '#ffecd2', '#fcb69f'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Availability Chart
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const availabilityData = days.map(() => Math.floor(Math.random() * 8) + 2);

            new Chart(document.getElementById('availabilityChart'), {
                type: 'bar',
                data: {
                    labels: days.map(d => d.substring(0, 3)),
                    datasets: [{
                        label: 'Available Doctors',
                        data: availabilityData,
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            document.getElementById('searchInput').addEventListener('input', filterDoctors);
            document.getElementById('specialtyFilter').addEventListener('change', filterDoctors);
            document.getElementById('availabilityFilter').addEventListener('change', filterDoctors);
            
            document.getElementById('doctorForm').addEventListener('submit', addDoctor);
        }

        // Filter doctors based on search and filters
        function filterDoctors() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const specialtyFilter = document.getElementById('specialtyFilter').value;
            const availabilityFilter = document.getElementById('availabilityFilter').value;

            filteredDoctors = doctors.filter(doctor => {
                const matchesSearch = doctor.name.toLowerCase().includes(searchTerm) ||
                                    doctor.specialty.toLowerCase().includes(searchTerm) ||
                                    doctor.clinic.toLowerCase().includes(searchTerm);
                
                const matchesSpecialty = !specialtyFilter || doctor.specialty === specialtyFilter;
                
                const matchesAvailability = !availabilityFilter || 
                                          (availabilityFilter === 'available' && doctor.isAvailable) ||
                                          (availabilityFilter === 'unavailable' && !doctor.isAvailable);

                return matchesSearch && matchesSpecialty && matchesAvailability;
            });

            renderDoctors();
        }

        // Modal functions
        function openModal() {
            document.getElementById('doctorModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('doctorModal').style.display = 'none';
            document.getElementById('doctorForm').reset();
        }

        // Add new doctor
        function addDoctor(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const newDoctor = {
                name: document.getElementById('doctorName').value,
                specialty: document.getElementById('specialty').value,
                clinic: document.getElementById('clinic').value,
                timing: document.getElementById('timing').value,
                phone: document.getElementById('phone').value,
                
                isAvailable: Math.random() > 0.3 // Random availability for demo
            };

            doctors.push(newDoctor);
            filteredDoctors = [...doctors];
            
            renderDoctors();
            updateStats();
            populateFilters();
            closeModal();
            
            // Show success message
            alert('Doctor added successfully!');
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('doctorModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Initialize the app when page loads
        document.addEventListener('DOMContentLoaded', init);

