import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
    // Get the URL from the block
    const url = block.querySelector('a').href;
    
    try {
        // Fetch data from the URL
        const response = await fetch(url);
        const data = await response.json();
        
        // Define the groups
        const groups = [
            { range: 'A-C', start: 'A', end: 'C' },
            { range: 'D-G', start: 'D', end: 'G' },
            { range: 'H-L', start: 'H', end: 'L' },
            { range: 'M-O', start: 'M', end: 'O' },
            { range: 'P-S', start: 'P', end: 'S' },
            { range: 'T-Z', start: 'T', end: 'Z' }
        ];

        // Create container for all tables
        const tablesContainer = document.createElement('div');
        tablesContainer.className = 'tables-container';

        // Headers configuration
        const headers = [
            { text: 'Country', width: '' },
            { text: 'Courier parcels & letters¹', width: '16%', link: '/sending/parcels-overseas/courier' },
            { text: 'Express parcels & letters', width: '16%', link: '/sending/parcels-overseas/express' },
            { text: 'Standard parcels', width: '16%', link: '/sending/parcels-overseas/standard' },
            { text: 'Economy parcels¹, ²', width: '16%', link: '/sending/parcels-overseas/economy' },
            { text: 'Economy Air & International Post Registered letters', width: '16%', links: ['/sending/parcels-overseas/economy', '/sending/letters-overseas/registered-post'] }
        ];

        // Create tables for each group
        groups.forEach((group, index) => {
            // Filter countries for this group
            const groupCountries = data.data.deliveryList.items.filter(item => {
                const firstLetter = item.country.charAt(0).toUpperCase();
                return firstLetter >= group.start && firstLetter <= group.end;
            });

            if (groupCountries.length > 0) {
                // Create accordion section
                const accordionSection = document.createElement('div');
                accordionSection.className = 'accordion-section';
                
                // Create accordion header
                const accordionHeader = document.createElement('button');
                accordionHeader.className = 'accordion-header';
                accordionHeader.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
                accordionHeader.setAttribute('aria-controls', `panel-${group.range}`);
                
                // Add arrow icon and text to header
                const arrowIcon = document.createElement('span');
                arrowIcon.className = 'accordion-arrow';
                arrowIcon.innerHTML = '▼';
                
                const headerText = document.createElement('span');
                headerText.textContent = `${group.range} Destinations`;
                
                accordionHeader.appendChild(arrowIcon);
                accordionHeader.appendChild(headerText);
                
                // Create accordion content
                const accordionContent = document.createElement('div');
                accordionContent.className = 'accordion-content';
                accordionContent.id = `panel-${group.range}`;
                accordionContent.style.display = index === 0 ? 'block' : 'none';
                
                // Create table container
                const tableContainer = document.createElement('div');
                tableContainer.className = 'tables tables--service bg-color';
                
                // Create table
                const table = document.createElement('table');
                
                // Create table header
                const tbody = document.createElement('tbody');
                const headerRow = document.createElement('tr');
                
                // Add headers
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.setAttribute('scope', 'col');
                    if (header.width) th.setAttribute('width', header.width);
                    
                    if (header.link) {
                        const a = document.createElement('a');
                        a.href = header.link;
                        a.textContent = header.text.split(' ')[0];
                        th.appendChild(a);
                        th.innerHTML += '&nbsp;' + header.text.substring(header.text.indexOf(' ') + 1);
                    } else if (header.links) {
                        const text = header.text.split(' & ');
                        const a1 = document.createElement('a');
                        a1.href = header.links[0];
                        a1.textContent = text[0];
                        const a2 = document.createElement('a');
                        a2.href = header.links[1];
                        a2.textContent = 'International Post Registered';
                        th.appendChild(a1);
                        th.innerHTML += ' & ';
                        th.appendChild(a2);
                        th.innerHTML += '&nbsp;letters';
                    } else {
                        th.textContent = header.text;
                    }
                    
                    headerRow.appendChild(th);
                });
                
                tbody.appendChild(headerRow);
                
                // Add data rows
                groupCountries.forEach(item => {
                    const row = document.createElement('tr');
                    
                    // Country column
                    const countryTh = document.createElement('th');
                    countryTh.textContent = item.country;
                    row.appendChild(countryTh);
                    
                    // Service columns
                    const services = [
                        { title: 'Courier parcels & letters¹', value: item.courierParcelsLetters },
                        { title: 'Express parcels & letters', value: item.expressParcelsLetters },
                        { title: 'Standard parcels', value: item.standardParcels },
                        { title: 'Economy parcels¹, ²', value: item.economyParcels },
                        { title: 'Economy Air & International Post Registered letters', value: item.economyLetters }
                    ];
                    
                    services.forEach(service => {
                        const td = document.createElement('td');
                        const titleP = document.createElement('p');
                        titleP.innerHTML = `<b>${service.title}</b>`;
                        const valueP = document.createElement('p');
                        valueP.textContent = service.value;
                        td.appendChild(titleP);
                        td.appendChild(valueP);
                        row.appendChild(td);
                    });
                    
                    tbody.appendChild(row);
                });
                
                table.appendChild(tbody);
                tableContainer.appendChild(table);
                accordionContent.appendChild(tableContainer);
                
                // Add click handler for accordion
                accordionHeader.addEventListener('click', () => {
                    const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';
                    accordionHeader.setAttribute('aria-expanded', !isExpanded);
                    accordionContent.style.display = isExpanded ? 'none' : 'block';
                    arrowIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
                });
                
                // Append accordion elements
                accordionSection.appendChild(accordionHeader);
                accordionSection.appendChild(accordionContent);
                tablesContainer.appendChild(accordionSection);
            }
        });

        // Clear existing content and append new tables
        block.textContent = '';
        block.appendChild(tablesContainer);
        
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        block.innerHTML = '<p>Error loading delivery information</p>';
    }
}