export type FoodFormatType = 'restaurant' | 'delivery' | 'both';

export type RestaurantDishType =
  | 'steak-meat'
  | 'pasta-risotto'
  | 'bruschetta-tapas'
  | 'gourmet-salads'
  | 'baked-fish'
  | 'truffle-dishes'
  | 'baked-veggies';

export type AllergyType =
  | 'none'
  | 'nuts'
  | 'seafood'
  | 'lactose'
  | 'gluten'
  | 'vegetarian'
  | 'citrus'
  | 'mushrooms';

export type PizzaType =
  | 'pepperoni'
  | '4cheese'
  | 'meat'
  | 'margarita'
  | 'bbq'
  | 'mushrooms'
  | 'hawaii'
  | 'seafood-p'
  | 'truffle'
  | 'no-pizza';

export type SushiType =
  | 'philadelphia'
  | 'california'
  | 'baked'
  | 'tempura'
  | 'unagi'
  | 'spicy'
  | 'veggie-sushi'
  | 'no-sushi';

export type SnackType =
  | 'chips-nachos'
  | 'nuggets'
  | 'cheese-plate'
  | 'meat-cuts'
  | 'veggies'
  | 'nuts'
  | 'garlic-bread'
  | 'fries'
  | 'wings';

export type AvoidType =
  | 'none'
  | 'pineapple'
  | 'cilantro'
  | 'super-spicy'
  | 'onion-garlic'
  | 'mayo'
  | 'olives'
  | 'fatty-meat';

export type AlcoholPrefType = 'alcohol' | 'light' | 'non-alc';

export type AlcoholType =
  | 'prosecco'
  | 'white-wine'
  | 'red-wine'
  | 'cider'
  | 'beer-light'
  | 'beer-craft'
  | 'gin'
  | 'cocktails'
  | 'whiskey'
  | 'rum'
  | 'shots'
  | 'tequila';

export type SoftDrinkType =
  | 'cola'
  | 'cola-zero'
  | 'juice'
  | 'energy'
  | 'water'
  | 'lemonade'
  | 'beer-noalc'
  | 'tonic';

export type DessertType =
  | 'cake'
  | 'icecream'
  | 'fruits'
  | 'cupcakes'
  | 'eclairs'
  | 'none';

export interface SurveyResponse {
  id: string;
  name: string;
  foodFormat: FoodFormatType;
  restaurantDishes?: RestaurantDishType[];
  allergies: AllergyType[];
  pizza: PizzaType[];
  sushi: SushiType[];
  snacks: SnackType[];
  spice: number; // 1 to 5
  avoid: AvoidType[];
  alcoholPref: AlcoholPrefType;
  alcoholTypes: AlcoholType[];
  softDrinks: SoftDrinkType[];
  desserts: DessertType[];
  wishes?: string;
  agentId?: string;
  submittedAt: string;
}

export interface ValorantAgent {
  id: string;
  name: string;
  title: string;
  role: string;
  themeColor: string;
  quote: string;
  img: string;
  lore: string;
  tags: string[];
}

export type ActiveTab = 'landing' | 'survey' | 'thankyou' | 'analytics' | 'calculator' | 'party-info';
