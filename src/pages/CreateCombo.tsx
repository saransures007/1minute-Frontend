import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ChefHat, Play, Trophy, Check, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const bases = [
  { id: "maggi", name: "Classic Maggi", price: 29, emoji: "🍜" },
  { id: "brownie", name: "Brownie", price: 30, emoji: "🍫" },
  { id: "coffee", name: "Cold Coffee", price: 40, emoji: "☕" },
  { id: "sandwich", name: "Bread Base", price: 20, emoji: "🍞" },
];

const proteins = [
  { id: "cheese", name: "Cheese Cube", price: 10, emoji: "🧀" },
  { id: "egg", name: "Boiled Egg", price: 15, emoji: "🥚" },
  { id: "chicken", name: "Chicken Bits", price: 25, emoji: "🍗" },
  { id: "paneer", name: "Paneer", price: 20, emoji: "🧈" },
];

const toppings = [
  { id: "butter", name: "Butter", price: 10, emoji: "🧈" },
  { id: "spicy", name: "Peri-Peri", price: 0, emoji: "🌶️" },
  { id: "extraCheese", name: "Extra Cheese", price: 5, emoji: "🧀" },
  { id: "herbs", name: "Italian Herbs", price: 0, emoji: "🌿" },
  { id: "mayo", name: "Mayo", price: 5, emoji: "🥫" },
  { id: "nuts", name: "Nuts", price: 15, emoji: "🥜" },
];

const trendingCombos = [
  { name: "Maggi Bomb", creator: "@foodie_rahul", sales: 342, rating: 4.8, ingredients: "Maggi + Cheese + Butter + Egg", price: 64 },
  { name: "Midnight Dessert Box", creator: "@night_craver", sales: 287, rating: 4.9, ingredients: "Brownie + Ice Cream + Hot Chocolate", price: 95 },
  { name: "Office Energy Pack", creator: "@techie_arun", sales: 156, rating: 4.5, ingredients: "Red Bull + Protein Bar + Nuts", price: 205 },
];

const videoTutorials = [
  { title: "Chocolate Lava Mug Cake", duration: "2 mins", views: "1.2M", creator: "1 Minute Chef" },
  { title: "Protein Maggi Bomb", duration: "4 mins", views: "847K", creator: "@student_life" },
  { title: "Cold Coffee Frappe", duration: "2 mins", views: "654K", creator: "1 Minute Store" },
];

const storeRecipes = [
  { name: "Chocolate Lava Mug Cake", emoji: "🍫", time: "2 mins", tag: "🔥 Most Popular", price: 105, ingredients: ["Brownie", "Hot Chocolate Sauce", "Vanilla Ice Cream", "Chocolate Chips", "Nuts"], steps: ["Take a microwave-safe mug and add brownie", "Microwave for 30 seconds until warm", "Pour hot chocolate sauce over warm brownie", "Top with vanilla ice cream scoop", "Sprinkle chocolate chips and nuts"] },
  { name: "Protein Coffee Shake", emoji: "🥤", time: "3 mins", tag: "💪 High Protein", price: 85, ingredients: ["Cold Coffee", "Protein Bar", "Milk", "Ice"], steps: ["Blend cold coffee with ice", "Crumble protein bar", "Mix everything", "Serve cold"] },
  { name: "Midnight Dessert Box", emoji: "🍦", time: "5 mins", tag: "🌙 Night Special", price: 120, ingredients: ["Brownie", "Ice Cream", "Hot Chocolate", "Whipped Cream"], steps: ["Warm brownie", "Layer with ice cream", "Drizzle chocolate", "Top with cream"] },
];

type BuilderStep = "browse" | "base" | "protein" | "topping" | "name" | "preview" | "submitted" | "recipe";

const CreateCombo = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<BuilderStep>("browse");
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedProteins, setSelectedProteins] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [comboName, setComboName] = useState("");
  const [description, setDescription] = useState("");
  const [viewRecipe, setViewRecipe] = useState<typeof storeRecipes[0] | null>(null);

  const getTotal = () => {
    let total = 0;
    const base = bases.find(b => b.id === selectedBase);
    if (base) total += base.price;
    selectedProteins.forEach(id => { const p = proteins.find(p => p.id === id); if (p) total += p.price; });
    selectedToppings.forEach(id => { const t = toppings.find(t => t.id === id); if (t) total += t.price; });
    return total;
  };

  const getSelectedItems = () => {
    const items: { name: string; price: number; emoji: string }[] = [];
    const base = bases.find(b => b.id === selectedBase);
    if (base) items.push(base);
    selectedProteins.forEach(id => { const p = proteins.find(p => p.id === id); if (p) items.push(p); });
    selectedToppings.forEach(id => { const t = toppings.find(t => t.id === id); if (t) items.push(t); });
    return items;
  };

  const toggleProtein = (id: string) => setSelectedProteins(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const toggleTopping = (id: string) => setSelectedToppings(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const resetBuilder = () => { setStep("browse"); setSelectedBase(null); setSelectedProteins([]); setSelectedToppings([]); setComboName(""); setDescription(""); };

  const handleSubmit = () => {
    setStep("submitted");
    toast({ title: "Combo submitted! 🎉", description: "Admin will review within 24 hours." });
  };

  const ItemButton = ({ item, selected, onToggle }: { item: { id: string; name: string; price: number; emoji: string }; selected: boolean; onToggle: () => void }) => (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onToggle}
      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selected ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/50"}`}>
      <span className="text-2xl mb-1">{item.emoji}</span>
      <span className="text-xs font-medium">{item.name}</span>
      <span className="text-[10px] text-muted-foreground">{item.price > 0 ? `+₹${item.price}` : "Free"}</span>
      {selected && <Check className="w-3.5 h-3.5 text-primary mt-1" />}
    </motion.button>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {step === "browse" && (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Hero */}
              <AnimatedSection>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Create Your Own Combo 🍳</h1>
                  <p className="text-muted-foreground">Mix & match products to create your signature dish! Get points when others buy!</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-8">
                  <Button size="lg" className="w-full text-lg py-6" onClick={() => setStep("base")}>
                    <ChefHat className="w-5 h-5 mr-2" /> Start Building <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </AnimatedSection>

              {/* Trending */}
              <AnimatedSection delay={0.1}>
                <h2 className="text-xl font-display font-bold mb-4">🔥 Trending Combos</h2>
                <div className="space-y-3 mb-8">
                  {trendingCombos.map((combo, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold">{combo.name}</p>
                              <p className="text-xs text-muted-foreground">by {combo.creator}</p>
                              <p className="text-xs text-muted-foreground mt-1">{combo.ingredients}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">₹{combo.price}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">⭐ {combo.rating} • {combo.sales} sold</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Store Recipes */}
              <AnimatedSection delay={0.2}>
                <h2 className="text-xl font-display font-bold mb-4">👨‍🍳 Store Signature Recipes</h2>
                <div className="space-y-3 mb-8">
                  {storeRecipes.map((recipe, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setViewRecipe(recipe); setStep("recipe"); }}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <span className="text-3xl">{recipe.emoji}</span>
                          <div className="flex-1">
                            <p className="font-bold">{recipe.name}</p>
                            <p className="text-xs text-muted-foreground">⏱️ {recipe.time} • {recipe.tag}</p>
                          </div>
                          <Badge>₹{recipe.price}</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Videos */}
              <AnimatedSection delay={0.3}>
                <h2 className="text-xl font-display font-bold mb-4">🎥 Video Recipes</h2>
                <div className="space-y-3">
                  {videoTutorials.map((video, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Play className="w-5 h-5 text-primary" /></div>
                        <div className="flex-1">
                          <p className="font-medium">{video.title}</p>
                          <p className="text-xs text-muted-foreground">⏱️ {video.duration} • {video.views} views • by {video.creator}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AnimatedSection>
            </motion.div>
          )}

          {step === "recipe" && viewRecipe && (
            <motion.div key="recipe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Button variant="ghost" className="mb-4" onClick={() => { setStep("browse"); setViewRecipe(null); }}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <h1 className="text-2xl font-display font-bold mb-2">{viewRecipe.emoji} {viewRecipe.name}</h1>
              <div className="flex gap-2 mb-6"><Badge variant="secondary">{viewRecipe.tag}</Badge><Badge variant="outline">⏱️ {viewRecipe.time}</Badge></div>

              <Card className="mb-6"><CardContent className="p-4">
                <p className="text-sm font-medium mb-3">What You Need:</p>
                <div className="flex flex-wrap gap-2">
                  {viewRecipe.ingredients.map((ing, i) => <Badge key={i} variant="secondary">{ing}</Badge>)}
                </div>
              </CardContent></Card>

              <h3 className="font-bold mb-3">Step-by-Step:</h3>
              <div className="space-y-3 mb-6">
                {viewRecipe.steps.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card><CardContent className="p-4 flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{i + 1}</div>
                      <p className="text-sm">{s}</p>
                    </CardContent></Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl mb-4">
                <span className="font-bold">Total Cost:</span>
                <span className="text-xl font-bold text-primary">₹{viewRecipe.price}</span>
              </div>
              <Button className="w-full" size="lg">Add All Ingredients to Cart 🛒</Button>
            </motion.div>
          )}

          {(step === "base" || step === "protein" || step === "topping" || step === "name") && (
            <motion.div key="builder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Button variant="ghost" className="mb-4" onClick={() => {
                if (step === "base") resetBuilder();
                else if (step === "protein") setStep("base");
                else if (step === "topping") setStep("protein");
                else setStep("topping");
              }}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>

              <div className="flex gap-1 mb-6">
                {["base", "protein", "topping", "name"].map((s, i) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${
                    ["base", "protein", "topping", "name"].indexOf(step) >= i ? "bg-primary" : "bg-muted"
                  }`} />
                ))}
              </div>

              {step === "base" && (
                <>
                  <h2 className="text-xl font-display font-bold mb-4">Step 1: Choose Your Base</h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {bases.map(b => <ItemButton key={b.id} item={b} selected={selectedBase === b.id} onToggle={() => setSelectedBase(b.id)} />)}
                  </div>
                  <Button className="w-full" disabled={!selectedBase} onClick={() => setStep("protein")}>Next: Add Proteins <ArrowRight className="w-4 h-4 ml-1" /></Button>
                </>
              )}

              {step === "protein" && (
                <>
                  <h2 className="text-xl font-display font-bold mb-4">Step 2: Add Proteins</h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {proteins.map(p => <ItemButton key={p.id} item={p} selected={selectedProteins.includes(p.id)} onToggle={() => toggleProtein(p.id)} />)}
                  </div>
                  <Button className="w-full" onClick={() => setStep("topping")}>Next: Add Toppings <ArrowRight className="w-4 h-4 ml-1" /></Button>
                </>
              )}

              {step === "topping" && (
                <>
                  <h2 className="text-xl font-display font-bold mb-4">Step 3: Add Toppings</h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {toppings.map(t => <ItemButton key={t.id} item={t} selected={selectedToppings.includes(t.id)} onToggle={() => toggleTopping(t.id)} />)}
                  </div>
                  <Button className="w-full" onClick={() => setStep("name")}>Next: Name It <ArrowRight className="w-4 h-4 ml-1" /></Button>
                </>
              )}

              {step === "name" && (
                <>
                  <h2 className="text-xl font-display font-bold mb-4">Step 4: Name Your Creation</h2>
                  <div className="space-y-4 mb-6">
                    <div><label className="text-sm font-medium">Combo Name *</label><Input placeholder="e.g., Maggi Bomb Extra Protein" value={comboName} onChange={e => setComboName(e.target.value)} className="mt-1" /></div>
                    <div><label className="text-sm font-medium">Description</label><Textarea placeholder="Tell others what makes this special..." value={description} onChange={e => setDescription(e.target.value)} className="mt-1" rows={3} /></div>
                  </div>

                  <Card className="mb-6"><CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">Your Combo:</p>
                    {getSelectedItems().map((item, i) => (
                      <div key={i} className="flex justify-between py-1 text-sm border-b border-border/50 last:border-0">
                        <span>{item.emoji} {item.name}</span><span>₹{item.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 font-bold"><span>Total</span><span>₹{getTotal()}</span></div>
                  </CardContent></Card>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setStep("preview")}>Preview Combo</Button>
                    <Button variant="outline" className="flex-1" disabled={!comboName} onClick={handleSubmit}>Submit 🚀</Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === "preview" && (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Button variant="ghost" className="mb-4" onClick={() => setStep("name")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <div className="text-center p-8 bg-muted/30 rounded-2xl mb-6">
                <p className="text-4xl mb-2">{getSelectedItems().map(i => i.emoji).join(" + ")} = 🎉</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm text-muted-foreground">Your creation looks amazing!</motion.p>
              </div>
              <h2 className="text-xl font-display font-bold mb-1">{comboName || "Untitled Combo"}</h2>
              <p className="text-sm text-muted-foreground mb-4">by You</p>
              {description && <p className="text-sm bg-muted/30 p-3 rounded-lg mb-4 italic">"{description}"</p>}
              <Card className="mb-6"><CardContent className="p-4">
                {getSelectedItems().map((item, i) => (
                  <div key={i} className="flex justify-between py-1 text-sm border-b border-border/50 last:border-0">
                    <span>{item.emoji} {item.name}</span><span>₹{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold text-primary"><span>Total</span><span>₹{getTotal()}</span></div>
              </CardContent></Card>
              <Button className="w-full" size="lg" disabled={!comboName} onClick={handleSubmit}>Submit for Approval 🚀</Button>
              <p className="text-xs text-muted-foreground text-center mt-2">✨ Get 50 points if approved & sells!</p>
            </motion.div>
          )}

          {step === "submitted" && (
            <motion.div key="submitted" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Combo Submitted! 🎉</h2>
              <p className="text-muted-foreground mb-6">Admin will review within 24 hours. You'll be notified!</p>
              <p className="text-sm mb-6">⏳ Status: <Badge>Pending Approval</Badge></p>
              <Button onClick={resetBuilder}>Create Another Combo</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default CreateCombo;
