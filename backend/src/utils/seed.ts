import { supabaseService } from "../services/supabase.js";

if (!supabaseService) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to run seed script.");
}

// Seeds starter communities and sample posts for faster local verification.
const seed = async () => {
  const { data: communities } = await supabaseService!
    .from("communities")
    .upsert(
      [
        { slug: "news", name: "Mon News", description: "Community updates and local news." },
        { slug: "culture", name: "Mon Culture", description: "Language, tradition, and festivals." },
        { slug: "tech", name: "Mon Tech", description: "Technology discussions and startup ideas." }
      ],
      { onConflict: "slug" }
    )
    .select("id, slug");

  console.log("Seeded communities:", communities?.map((c) => c.slug).join(", "));
};

seed().then(() => process.exit(0));
