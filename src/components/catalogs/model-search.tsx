import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { catalogService } from "@/services/asset/catalog.service";
import { ModelList } from "@/types/catalog.type";

interface ModelSearchProps {
    value?: number;
    onChange: (modelId: number, model?: ModelList) => void;
    placeholder?: string;
}

export default function ModelSearch({value, onChange, placeholder = "Buscar marca, modelo o procesador..."}: ModelSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ModelList[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);

    useEffect(() => {
        if (isSelecting) {
            setIsSelecting(false);
            return;
        }
        const timeout = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            try {
                const response = await catalogService.getModels({search: query, page: 1});
                setResults(response.data ?? []);
            } catch (error) {
                console.error(error);
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if(!value) return;

        const loadSelectedModel = async () => {
            try {
                const response = await catalogService.getModel(value);

                setQuery(
                    `${response.data.brand} ${response.data.model}`
                );
            } catch (error) {
                console.error(error);
            }
        }

        loadSelectedModel();
    }, [value]);
    return (
        <div className="relative">
            <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() =>
                    setTimeout(() => setResults([]), 200)
                }
            />
            {results.length > 0 && (
                <div className="absolute z-50 w-full border rounded-md bg-background mt-1 max-h-48 overflow-y-auto shadow-md">
                    {results.map((model) => (
                        <div
                            key={model.modelId}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => {
                                setIsSelecting(true);
                                setQuery(`${model.brand} ${model.model}`);
                                onChange(model.modelId, model);
                                setResults([]);
                            }}
                        >
                            <div className="font-medium">
                                {model.brand} {model.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {model?.processor?.[0]?.name ?? ""}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}