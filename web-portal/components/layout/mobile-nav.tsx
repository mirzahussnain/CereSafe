import { MobileNav as MobileNavType, NavGroupType, NavItem } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut } from "@/utils/helpers/auth";
import router from "next/router";
import { toast } from "sonner";

export function MobileNav({
  isMobileMenuOpen,
  navItems,
  pathname,
  toggleMobileMenu,
  user,
}: MobileNavType) {
     const handleLogout = async () => {
    
    const result = await signOut();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden w-full bg-background dark:bg-neutral-900 absolute top-20 left-0 shadow-lg z-40 border-t border-neutral-800"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <ul className="flex flex-col items-center py-4 space-y-4">
            <motion.li
              className="w-full px-4 flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (navItems.length + 1) * 0.1 }}
            >
              {user ? (
                <>
                <Link href={"/profile"} className="flex items-center gap-2 px-4 py-2">
                  <Image
                    src={user?.user_metadata?.avatar_url || "/avatar.jpg"}
                    alt="User profile picture"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <span className="text-lg font-medium text-primary">
                    {user?.user_metadata?.full_name}
                  </span>
                </Link>
                <Button onClick={handleLogout}>
                    Sign Out
                </Button>
                
                </>
              ) : (
                <Link
                  href="/login"
                  className="block mx-auto w-[5rem] text-center py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 rounded-xl"
                >
                  Login
                </Link>
              )}
            </motion.li>
            {navItems?.map((item, index) => (
              <motion.li
                key={Array.isArray(item) ? `services-${index}` : item.href}
                className="w-full px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {Array.isArray(item) ? (
                  <div>
                    <div className="text-sm font-medium text-primary/40 px-4 py-2 border-b-1 rounded-b-2xl">
                      Services
                    </div>
                    <ul className="pl-6 space-y-2 ">
                      {item.map((service) => (
                        <li key={service.href} className="border-b-1 rounded-b-2xl ">
                          <Link
                            href={service.href}
                            className={`block px-4 py-2 text-sm font-medium text-primary hover:text-secondary rounded-b-2xl  ${
                              pathname === service.href &&
                              "text-secondary underline underline-offset-4 bg-accent-foreground "
                            }`}
                            onClick={toggleMobileMenu}
                          >
                            {service.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item?.href}
                    className={`block px-4 py-2 text-sm font-medium text-primary hover:text-secondary  border-b-1 ${
                      pathname === item?.href &&
                      "text-secondary underline underline-offset-4 bg-accent-foreground/80 rounded-2xl"
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    {item?.label}
                  </Link>
                )}
              </motion.li>
            ))}

            <motion.li
              className="w-[12rem] px-4 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Link
              href={'/services/stroke-prediction'}
                className="w-full text-center py-2 text-sm font-semibold border-2 bg-overlay-2   rounded-xl transition"
                onClick={toggleMobileMenu}
              >
                Get Started
              </Link>
            </motion.li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
