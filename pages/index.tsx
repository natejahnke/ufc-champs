
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  )
  const { data } = await supabaseAdmin.from("champions").select("*").order("weightclassOrder")
  return {
    props: {
      champs: data,
    },
  }
}


function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Image = {
  id: number
  twitter_href: string
  imageSrc: string
  name: string
  weight_class: string
}

export default function Gallery({ champs }: { champs: Image[] }) {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {champs.map((champ) => (
           <BlurImage key={champ.id} champ={champ} />  
        ))}
      </div>
    </div>
    )
}

function BlurImage({ champ }: { champ: Image }) {
  const [isLoading, setLoading] = useState(true);

  let nameArray = champ.name.split(" ");
  let first = nameArray[1]
  let last = nameArray[0]
  let fullName = first + " " + last.replace(',', ' ')
  // console.log(first + " " + last.replace(',', ' '))
  
  return (
    <Link href={champ.twitter_href} className="group">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt="placeholder blur"
          fill
          src={champ.imageSrc}
          className={cn(
            "group-hover:opacity-75 duration-700 ease-in-out",
            isLoading
              ? "grayscale blur-2xl scale-110"
              : "grayscale-0 blur-0 scale-100"
          )}
          onLoadingComplete={() => setLoading(false)}
        />  
      </div>
      <h3 className="mt-4 text-sm text-gray-700 capitalize">{champ.weight_class.replace("_", " ")}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{fullName}</p>
    </Link>
  )
}


