Months = (
    ('January', 'January'),
    ('February', 'February'),
    ('March', 'March'),
    ('April','April'),
    # ('May','May'),
    # Add other months as needed
)

COUNTRY_CHOICES = (
    ('IN', 'India, IN'),
    ('US', 'United States, US'),
    ('CA', 'Canada, CA'),
    ('GB', 'United Kingdom, GB'),
    ('AU', 'Australia, AU'),
    ('DE', 'Germany, DE'),
    ('FR', 'France, FR'),
    ('JP', 'Japan, JP'),
    ('CN', 'China, CN'),
    ('BR', 'Brazil, BR'),
    ('RU', 'Russia, RU'),
    ('ZA', 'South Africa, ZA'),
    ('MX', 'Mexico, MX'),
    ('IT', 'Italy, IT'),
    ('ES', 'Spain, ES'),
    ('NL', 'Netherlands, NL'),
    ('SE', 'Sweden, SE'),
    ('CH', 'Switzerland, CH'),
    ('KR', 'South Korea, KR'),
    ('SG', 'Singapore, SG'),
    # Add more countries as needed
)

INDUSTRY_CHOICES = [
    ('energy', 'Energy sector including waste to energy'),
    ('ch4_mitigation', 'CH4 mitigation sector (Venting and flaring removal)'),
    ('dac_ccus', 'DAC or CCUS'),
    ('composting_waste', 'Composting or waste management'),
    ('plastic_alternatives', 'Alternatives to plastics'),
    ('none', 'None of the above'),
]

SUB_SECTOR_CHOICES = [
    ('solar', 'Solar'),
    ('wind', 'Wind'),
    ('hydro', 'Hydro'),
    ('geothermal', 'Geothermal'),
    ('tidal_energy', 'Tidal energy'),
    ('ch4_venting_removal', 'CH4 venting removal'),
    ('ch4_flaring_removal', 'CH4 flaring removal'),
    ('ccus', 'CCUS'),
    ('dac', 'DAC'),
    ('waste_composting', 'Waste composting'),
    ('composters', 'Composters'),
    ('plastic_alternatives', 'Alternatives to plastics materials'),
    ('waste_to_energy', 'Waste to energy'),
    ('none', 'None of the above'),
]

COUNTRY = [
    ('least_developed', 'Classified region/country as atleast developed by World Bank'),
    ('india', 'India'),
    ('china', 'China'),
    ('developing_country', 'Other developing countries as classified by world bank'),
    ('developed_country', 'Developed country as classified by world bank'),
]

ACTIVITY_PERFORMED_CHOICES = [
    ('generation', 'Generation of renewable energy or alternative energy'),
    ('sale_to_grid', 'Renewable energy sale to the grid'),
    ('selling_alternatives', 'Selling plastic alternatives'),
    ('selling_composters', 'Selling composters'),
    ('suppliers_to_renewables', 'Selling sub-parts and semi-finished parts required for enabling renewable energy sector ie., suppliers to renewable energy generation company'),
    ('distribution', 'Distribution of solar panels or windmills etc'),
]

# DATA_AVAILABLE_CHOICES = [
#     ('electricity_usage', 'Electricity usage'),
#     ('material_used', 'Material used'),
#     ('waste_generated', 'Waste generated in operations'),
#     ('transportation', 'Transportation'),
#     ('sale_of_products', 'Sale of products'),
#     ('profit_loss', 'Profit and loss statements'),
#     ('chemical_alternatives', 'Chemical Alternatives'),
# ]
DATA_AVAILABLE_CHOICES = [
    ('Electricity usage', 'Electricity usage'),
    ('Material used', 'Material used'),
    ('Waste generated in operations', 'Waste generated in operations'),
    ('Transportation', 'Transportation'),
    ('Sale of products', 'Sale of products'),
    ('Profit and loss statements', 'Profit and loss statements'),
    ('Chemical Alternatives', 'Chemical Alternatives'),
]

# DISPOSAL_METHODS = [
#         ('landfill', 'Land Fill Products'),
#         ('composting', 'Composting'),
#         ('incineration', 'Incineration (Burning)'),
#         ('recycling', 'Recycling'),
#     ]